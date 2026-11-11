/* ==========================================================================
   Main Portfolio Interactions
   Navbar state, mobile drawer, scroll reveal, skill filter, & project modal.
   ========================================================================== */

(function initPortfolioApp() {
  const header = document.getElementById('site-header');
  const progressBar = document.getElementById('scroll-progress-bar');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-drawer__link');
  const sections = document.querySelectorAll('main section[id]');

  /* Toast Utility */
  const toastEl = document.getElementById('portfolio-toast');
  let toastTimer = null;

  window.showPortfolioToast = function showPortfolioToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove('is-visible');
    }, 3200);
  };

  /* Scroll Progress & Sticky Header Shadow */
  function handleScroll() {
    const scrollY = window.scrollY;
    if (header) {
      header.classList.toggle('is-scrolled', scrollY > 18);
    }

    if (progressBar) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const percent = docHeight > 0 ? Math.min(100, (scrollY / docHeight) * 100) : 0;
      progressBar.style.width = percent.toFixed(2) + '%';
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* Active Section Highlighting */
  if ('IntersectionObserver' in window && sections.length) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            const href = link.getAttribute('href');
            link.classList.toggle('is-active', href === '#' + id);
          });
        });
      },
      {
        rootMargin: '-35% 0px -50% 0px',
        threshold: 0.01
      }
    );

    sections.forEach((section) => navObserver.observe(section));
  }

  /* Scroll Reveal Animations */
  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealItems.length) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  /* Accessible Mobile Drawer */
  const navToggle = document.getElementById('nav-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerClose = document.getElementById('drawer-close');
  const drawerBackdrop = document.getElementById('drawer-backdrop');
  const drawerLinks = document.querySelectorAll('.mobile-drawer__link, .mobile-drawer__cta');

  function openDrawer() {
    if (!mobileDrawer || !navToggle) return;
    mobileDrawer.classList.add('is-open');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    if (drawerClose) drawerClose.focus();
  }

  function closeDrawer(options) {
    if (!mobileDrawer || !navToggle) return;
    const wasOpen = mobileDrawer.classList.contains('is-open');
    mobileDrawer.classList.remove('is-open');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (wasOpen && options && options.restoreFocus) {
      navToggle.focus();
    }
  }

  if (navToggle) navToggle.addEventListener('click', openDrawer);
  if (drawerClose) drawerClose.addEventListener('click', () => closeDrawer({ restoreFocus: true }));
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', () => closeDrawer());

  drawerLinks.forEach((link) => {
    link.addEventListener('click', () => closeDrawer());
  });

  /* Skill Category Filter */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-filter');

      filterBtns.forEach((other) => {
        const isCurrent = other === btn;
        other.classList.toggle('is-active', isCurrent);
        other.setAttribute('aria-pressed', isCurrent ? 'true' : 'false');
      });

      skillCards.forEach((card) => {
        const cardCat = card.getAttribute('data-category');
        const visible = category === 'all' || cardCat === category;
        card.classList.toggle('is-hidden', !visible);
      });
    });
  });

  /* Project Details Modal */
  const modal = document.getElementById('project-modal');
  const modalBackdrop = document.getElementById('modal-backdrop');
  const modalClose = document.getElementById('modal-close');
  const modalBadge = document.getElementById('modal-badge');
  const modalTitle = document.getElementById('modal-title');
  const modalSummary = document.getElementById('modal-summary');
  const modalHighlights = document.getElementById('modal-highlights');
  const modalStack = document.getElementById('modal-stack');
  const modalGithub = document.getElementById('modal-github');
  const projectTriggers = document.querySelectorAll('[data-project-id]');
  let lastFocusedTrigger = null;

  function openProjectModal(projectId, triggerEl) {
    const projects = window.PROJECTS_DATA || {};
    const project = projects[projectId];
    if (!modal || !project) return;

    lastFocusedTrigger = triggerEl || document.activeElement;

    if (modalBadge) modalBadge.textContent = project.badge;
    if (modalTitle) modalTitle.textContent = project.title;
    if (modalSummary) modalSummary.textContent = project.summary;
    if (modalGithub) modalGithub.href = project.githubUrl || '#';

    if (modalHighlights) {
      modalHighlights.replaceChildren();
      (project.highlights || []).forEach((point) => {
        const li = document.createElement('li');
        li.textContent = point;
        modalHighlights.appendChild(li);
      });
    }

    if (modalStack) {
      modalStack.replaceChildren();
      (project.stack || []).forEach((tech) => {
        const span = document.createElement('span');
        span.className = 'pill pill--accent';
        span.textContent = tech;
        modalStack.appendChild(span);
      });
    }

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (modalClose) modalClose.focus();
  }

  function closeProjectModal() {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocusedTrigger && typeof lastFocusedTrigger.focus === 'function') {
      lastFocusedTrigger.focus();
    }
  }

  projectTriggers.forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-project-id');
      openProjectModal(id, btn);
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeProjectModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeProjectModal);

  /* Global Escape Handler */
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (modal && modal.classList.contains('is-open')) {
      closeProjectModal();
    }
    if (mobileDrawer && mobileDrawer.classList.contains('is-open')) {
      closeDrawer({ restoreFocus: true });
    }
  });

  function formatDisplayUrl(url) {
    return String(url || '')
      .replace(/^https?:\/\/(www\.)?/i, '')
      .replace(/\/+$/, '');
  }

  /* Hydrate Editable Contact, Education & Project Links From Config */
  const cfg = window.PORTFOLIO_CONFIG;
  if (cfg) {
    document.querySelectorAll('[data-config-email]').forEach((el) => {
      el.textContent = cfg.email;
      if (el.tagName === 'A') el.href = 'mailto:' + cfg.email;
    });

    document.querySelectorAll('[data-config-email-href]').forEach((el) => {
      if (el.tagName === 'A') el.href = 'mailto:' + cfg.email;
    });

    document.querySelectorAll('[data-copy-email]').forEach((el) => {
      el.setAttribute('data-copy-email', cfg.email);
    });

    document.querySelectorAll('[data-config-github]').forEach((el) => {
      if (el.tagName === 'A') el.href = cfg.githubUrl;
    });

    document.querySelectorAll('[data-config-github-text]').forEach((el) => {
      el.textContent = formatDisplayUrl(cfg.githubUrl);
    });

    document.querySelectorAll('[data-config-linkedin]').forEach((el) => {
      if (el.tagName === 'A') el.href = cfg.linkedinUrl;
    });

    document.querySelectorAll('[data-config-linkedin-text]').forEach((el) => {
      el.textContent = formatDisplayUrl(cfg.linkedinUrl);
    });

    if (cfg.education) {
      document.querySelectorAll('[data-config-degree]').forEach((el) => {
        if (cfg.education.degreeFull) el.textContent = cfg.education.degreeFull;
      });
      document.querySelectorAll('[data-config-period]').forEach((el) => {
        if (cfg.education.period) el.textContent = cfg.education.period;
      });
      document.querySelectorAll('[data-config-institution]').forEach((el) => {
        if (cfg.education.institution) el.textContent = cfg.education.institution;
      });
      document.querySelectorAll('[data-config-location]').forEach((el) => {
        if (cfg.education.location) el.textContent = cfg.education.location;
      });
      document.querySelectorAll('[data-config-branch]').forEach((el) => {
        if (cfg.education.branch) el.textContent = cfg.education.branch;
      });
    }
  }

  const projectsMap = window.PROJECTS_DATA || {};
  document.querySelectorAll('[data-project-github]').forEach((el) => {
    const projectId = el.getAttribute('data-project-github');
    const project = projectsMap[projectId];
    if (project && project.githubUrl && el.tagName === 'A') {
      el.href = project.githubUrl;
    }
  });
})();
