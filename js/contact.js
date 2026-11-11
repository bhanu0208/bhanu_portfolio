/* ==========================================================================
   Contact Form Validation, Integration Adapter & Email Copy Helper
   ========================================================================== */

(function initContactModule() {
  const form = document.getElementById('contact-form');
  const statusBox = document.getElementById('form-status');
  const submitBtn = document.getElementById('contact-submit');
  const copyButtons = document.querySelectorAll('[data-copy-email]');
  const config = window.PORTFOLIO_CONFIG || {};

  function showToast(message) {
    if (typeof window.showPortfolioToast === 'function') {
      window.showPortfolioToast(message);
    }
  }

  /* Copy Email to Clipboard */
  copyButtons.forEach((btn) => {
    btn.addEventListener('click', async () => {
      const email = btn.getAttribute('data-copy-email') || config.email || '';
      if (!email) return;

      try {
        await navigator.clipboard.writeText(email);
        showToast('Email copied to clipboard: ' + email);
      } catch {
        showToast('Email address: ' + email);
      }
    });
  });

  if (!form || !statusBox || !submitBtn) return;

  const fields = {
    name: {
      input: document.getElementById('contact-name'),
      error: document.getElementById('error-name'),
      validate(value) {
        if (!value.trim()) return 'Please enter your name.';
        if (value.trim().length < 2) return 'Name should be at least 2 characters.';
        return '';
      }
    },
    email: {
      input: document.getElementById('contact-email'),
      error: document.getElementById('error-email'),
      validate(value) {
        const trimmed = value.trim();
        if (!trimmed) return 'Please enter your email address.';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!emailRegex.test(trimmed)) return 'Please enter a valid email address.';
        return '';
      }
    },
    subject: {
      input: document.getElementById('contact-subject'),
      error: document.getElementById('error-subject'),
      validate(value) {
        if (!value.trim()) return 'Please enter a subject.';
        if (value.trim().length < 3) return 'Subject should be at least 3 characters.';
        return '';
      }
    },
    message: {
      input: document.getElementById('contact-message'),
      error: document.getElementById('error-message'),
      validate(value) {
        if (!value.trim()) return 'Please write a short message.';
        if (value.trim().length < 10) return 'Message should be at least 10 characters.';
        return '';
      }
    }
  };

  function validateField(key) {
    const field = fields[key];
    if (!field || !field.input || !field.error) return true;

    const message = field.validate(field.input.value);
    field.error.textContent = message;
    field.input.classList.toggle('is-invalid', Boolean(message));
    field.input.setAttribute('aria-invalid', message ? 'true' : 'false');
    return !message;
  }

  Object.keys(fields).forEach((key) => {
    const input = fields[key].input;
    if (!input) return;

    input.addEventListener('blur', () => validateField(key));
    input.addEventListener('input', () => {
      if (input.classList.contains('is-invalid')) {
        validateField(key);
      }
    });
  });

  function clearStatus() {
    statusBox.className = 'form-status';
    statusBox.replaceChildren();
  }

  function renderStatus(type, message, mailtoUrl) {
    statusBox.className = 'form-status is-visible form-status--' + type;
    statusBox.replaceChildren();

    const textNode = document.createElement('div');
    const mainP = document.createElement('p');
    mainP.textContent = message;
    textNode.appendChild(mainP);

    if (mailtoUrl) {
      const link = document.createElement('a');
      link.href = mailtoUrl;
      link.className = 'form-fallback-link';
      link.textContent = 'Open in your default email app instead →';
      textNode.appendChild(link);
    }

    statusBox.appendChild(textNode);
  }

  function buildMailtoUrl(payload) {
    const recipient = config.email || 'v.bhanu.dev@example.com';
    const subject = encodeURIComponent('[Portfolio] ' + payload.subject);
    const body = encodeURIComponent(
      'Name: ' + payload.name + '\nEmail: ' + payload.email + '\n\n' + payload.message
    );
    return 'mailto:' + recipient + '?subject=' + subject + '&body=' + body;
  }

  function setSubmitting(isSubmitting) {
    submitBtn.disabled = isSubmitting;
    const label = submitBtn.querySelector('.btn-label');
    if (label) {
      label.textContent = isSubmitting ? 'Sending Message...' : 'Send Message';
    }
  }

  async function submitToConfiguredEndpoint(payload) {
    const cf = config.contactForm || {};

    if (cf.formspreeEndpoint) {
      const res = await fetch(cf.formspreeEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Formspree request failed');
      return { ok: true, message: 'Thank you! Your message has been sent via Formspree.' };
    }

    if (cf.web3formsKey) {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          access_key: cf.web3formsKey,
          subject: payload.subject,
          from_name: payload.name,
          email: payload.email,
          message: payload.message
        })
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Web3Forms error');
      return { ok: true, message: 'Thank you! Your message has been delivered via Web3Forms.' };
    }

    if (window.location.protocol === 'http:' || window.location.protocol === 'https:') {
      const endpoint = cf.localApiEndpoint || '/api/contact';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Contact server unavailable');
      }
      return data;
    }

    throw new Error('No live HTTP backend available');
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearStatus();

    const honeypot = form.querySelector('input[name="website"]');
    if (honeypot && honeypot.value.trim()) {
      renderStatus('success', 'Thank you for reaching out.');
      form.reset();
      return;
    }

    const keys = Object.keys(fields);
    const results = keys.map((key) => validateField(key));
    const firstInvalidIndex = results.indexOf(false);
    if (firstInvalidIndex !== -1) {
      const firstInvalid = keys[firstInvalidIndex];
      if (firstInvalid && fields[firstInvalid].input) {
        fields[firstInvalid].input.focus();
      }
      renderStatus('error', 'Please fix the highlighted fields before submitting.');
      return;
    }

    const payload = {
      name: fields.name.input.value.trim(),
      email: fields.email.input.value.trim(),
      subject: fields.subject.input.value.trim(),
      message: fields.message.input.value.trim()
    };

    const mailtoUrl = buildMailtoUrl(payload);
    setSubmitting(true);

    try {
      const result = await submitToConfiguredEndpoint(payload);
      renderStatus(
        'success',
        result.message || 'Message received! Thank you for getting in touch.'
      );
      form.reset();
      keys.forEach((key) => {
        fields[key].input.classList.remove('is-invalid');
        fields[key].error.textContent = '';
      });
      showToast('Message sent successfully');
    } catch {
      renderStatus(
        'info',
        'No external email API key is configured for static hosting yet, or the local server endpoint is unavailable. You can configure Formspree/Web3Forms in js/data.js or send directly via email.',
        mailtoUrl
      );
    } finally {
      setSubmitting(false);
    }
  });
})();
