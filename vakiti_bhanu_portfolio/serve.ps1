param(
  [int]$Port = 8080
)

$RootPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$LogPath = Join-Path $RootPath "contact_submissions.log"

$MimeTypes = @{
  ".html" = "text/html; charset=utf-8"
  ".css"  = "text/css; charset=utf-8"
  ".js"   = "application/javascript; charset=utf-8"
  ".json" = "application/json; charset=utf-8"
  ".svg"  = "image/svg+xml"
  ".png"  = "image/png"
  ".jpg"  = "image/jpeg"
  ".jpeg" = "image/jpeg"
  ".webp" = "image/webp"
  ".ico"  = "image/x-icon"
  ".pdf"  = "application/pdf"
}

$Listener = New-Object System.Net.HttpListener
$Prefix = "http://localhost:$Port/"
$Listener.Prefixes.Add($Prefix)
$Listener.Start()

Write-Host "V. Bhanu Portfolio server listening at $Prefix"
Write-Host "Press Ctrl+C to stop."

function Send-JsonResponse {
  param(
    [System.Net.HttpListenerResponse]$Response,
    [int]$StatusCode,
    [hashtable]$Payload
  )
  $Response.StatusCode = $StatusCode
  $Response.ContentType = "application/json; charset=utf-8"
  $Json = $Payload | ConvertTo-Json -Compress
  $Bytes = [System.Text.Encoding]::UTF8.GetBytes($Json)
  $Response.ContentLength64 = $Bytes.Length
  $Response.OutputStream.Write($Bytes, 0, $Bytes.Length)
  $Response.OutputStream.Close()
}

try {
  while ($Listener.IsListening) {
    $Context = $Listener.GetContext()
    $Request = $Context.Request
    $Response = $Context.Response
    $Path = $Request.Url.AbsolutePath

    if ($Path -eq "/api/contact") {
      if ($Request.HttpMethod -ne "POST") {
        Send-JsonResponse -Response $Response -StatusCode 405 -Payload @{ ok = $false; error = "Method not allowed" }
        continue
      }

      try {
        $Reader = New-Object System.IO.StreamReader($Request.InputStream, [System.Text.Encoding]::UTF8)
        $Body = $Reader.ReadToEnd()
        $Reader.Close()

        $Data = $Body | ConvertFrom-Json
        $Name = ([string]$Data.name).Trim()
        $Email = ([string]$Data.email).Trim()
        $Subject = ([string]$Data.subject).Trim()
        $Message = ([string]$Data.message).Trim()

        if ([string]::IsNullOrWhiteSpace($Name) -or
            [string]::IsNullOrWhiteSpace($Email) -or
            [string]::IsNullOrWhiteSpace($Subject) -or
            [string]::IsNullOrWhiteSpace($Message)) {
          Send-JsonResponse -Response $Response -StatusCode 400 -Payload @{
            ok = $false
            error = "All contact fields are required."
          }
          continue
        }

        if ($Email -notmatch '^[^\s@]+@[^\s@]+\.[^\s@]{2,}$') {
          Send-JsonResponse -Response $Response -StatusCode 400 -Payload @{
            ok = $false
            error = "Invalid email format."
          }
          continue
        }

        $Entry = [ordered]@{
          timestamp = (Get-Date).ToString("o")
          name      = $Name
          email     = $Email
          subject   = $Subject
          message   = $Message
        } | ConvertTo-Json -Compress

        Add-Content -Path $LogPath -Value $Entry -Encoding UTF8

        Send-JsonResponse -Response $Response -StatusCode 200 -Payload @{
          ok      = $true
          mode    = "local-server"
          message = "Thank you, $Name! Your message was received and saved locally."
        }
      } catch {
        Send-JsonResponse -Response $Response -StatusCode 400 -Payload @{
          ok    = $false
          error = "Malformed JSON request payload."
        }
      }
      continue
    }

    $Relative = $Path.TrimStart('/')
    if ([string]::IsNullOrWhiteSpace($Relative)) {
      $Relative = "index.html"
    }

    $TargetPath = Join-Path $RootPath ($Relative -replace '/', '\')
    $FullRoot = [System.IO.Path]::GetFullPath($RootPath)
    $FullTarget = [System.IO.Path]::GetFullPath($TargetPath)

    if (-not $FullTarget.StartsWith($FullRoot, [System.StringComparison]::OrdinalIgnoreCase) -or
        -not (Test-Path -LiteralPath $FullTarget -PathType Leaf)) {
      $Response.StatusCode = 404
      $NotFound = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
      $Response.OutputStream.Write($NotFound, 0, $NotFound.Length)
      $Response.OutputStream.Close()
      continue
    }

    $Ext = [System.IO.Path]::GetExtension($FullTarget).ToLowerInvariant()
    $Response.ContentType = if ($MimeTypes.ContainsKey($Ext)) { $MimeTypes[$Ext] } else { "application/octet-stream" }
    $Response.StatusCode = 200
    $FileBytes = [System.IO.File]::ReadAllBytes($FullTarget)
    $Response.ContentLength64 = $FileBytes.Length
    $Response.OutputStream.Write($FileBytes, 0, $FileBytes.Length)
    $Response.OutputStream.Close()
  }
} finally {
  $Listener.Stop()
  $Listener.Close()
}
