# V. Bhanu — Personal Developer Portfolio

Modern, responsive dark-theme personal portfolio built with semantic **HTML5**, modular **CSS3**, and vanilla **JavaScript**.

## Project Structure

```text
vakiti_bhanu_portfolio/
├── index.html                    # Semantic HTML5 markup & SEO metadata
├── serve.ps1                     # Local Windows PowerShell server + POST /api/contact handler
├── css/
│   ├── variables.css             # Theme palette, gradients, typography, and spacing tokens
│   ├── base.css                  # Reset, button styles, reveal animations, reduced-motion support
│   ├── layout.css                # Sticky navbar, scroll progress bar, mobile drawer, footer
│   └── sections.css              # Hero, About, Skills, Projects, Education, Contact, Modal
├── js/
│   ├── data.js                   # Editable personal links, email integration config, project data
│   ├── contact.js                # Form validation, backend/email integration, clipboard copy
│   └── main.js                   # Scroll progress, active nav, skill filters, project modal
└── assets/
    ├── favicon.svg               # Monogram favicon
    ├── profile-placeholder.svg   # Replaceable dark-mode profile avatar placeholder
    └── V_Bhanu_Resume.html       # Printable / downloadable resume template
```

## Customization Checklist

1. **Profile Image**: Replace `assets/profile-placeholder.svg` (or update the `<img src="...">` inside `index.html`).
2. **College & Branch**: Update `[Your College / University Name Placeholder]` and `[Branch Placeholder]` in the Education section of `index.html`.
3. **Social Links & Email**: Update `PORTFOLIO_CONFIG` in `js/data.js` (and fallback hrefs in `index.html`).
4. **Projects**: Update `PROJECTS_DATA` in `js/data.js` and the project cards in `index.html` as you build real projects.
5. **Resume**: Customize `assets/V_Bhanu_Resume.html` (or swap in a PDF file and update the `Download Resume` link).

## Contact Form Integration

- **Local Development**: Run `.\serve.ps1` and open `http://localhost:8080`. Submissions go to `POST /api/contact` and log to `contact_submissions.log`.
- **Static Hosting (GitHub Pages / Netlify / Vercel)**: Add either a `formspreeEndpoint` or `web3formsKey` in `js/data.js` under `PORTFOLIO_CONFIG.contactForm`. If neither is set, visitors get a pre-filled `mailto:` fallback link.

