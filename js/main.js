document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.querySelector('.header__menu-btn');
  const header = document.querySelector('.header');
  const overlay = document.getElementById('header-nav');

  const setMenuOpen = (open) => {
    if (!menuBtn || !header || !overlay) return;

    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
    header.classList.toggle('header--open', open);
    document.body.classList.toggle('is-menu-open', open);
    overlay.classList.toggle('is-open', open);
    overlay.setAttribute('aria-hidden', String(!open));

    if (open) {
      overlay.removeAttribute('inert');
      const firstLink = overlay.querySelector('.header__nav a');
      if (firstLink) firstLink.focus({ preventScroll: true });
    } else {
      overlay.setAttribute('inert', '');
      menuBtn.focus({ preventScroll: true });
    }
  };

  const closeMenu = () => setMenuOpen(false);

  if (menuBtn && header && overlay) {
    menuBtn.addEventListener('click', () => {
      const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
      setMenuOpen(!expanded);
    });

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeMenu();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && header?.classList.contains('header--open')) {
      closeMenu();
    }
  });

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (!id || id === '#') return;

      if (id === '#top') {
        e.preventDefault();
        closeMenu();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      closeMenu();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ---------- Scroll reveal ---------- */
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const markReveal = (selector, options = {}) => {
    document.querySelectorAll(selector).forEach((el, index) => {
      if (el.classList.contains('reveal')) return;
      el.classList.add('reveal');
      if (options.variant) el.classList.add(`reveal--${options.variant}`);
      if (options.stagger) {
        el.setAttribute('data-delay', String((index % 8) + 1));
      }
    });
  };

  markReveal('.campaign-banner .container', { variant: 'soft' });
  markReveal('.about__photos', { variant: 'left' });
  markReveal('.about__text', { variant: 'right' });
  markReveal('.feature-card', { stagger: true });
  markReveal('.programs__intro .section-heading');
  markReveal('.programs__lead', { variant: 'left' });
  markReveal('.program-tags li', { stagger: true, variant: 'soft' });
  markReveal('.facility .section-heading');
  markReveal('.facility-card', { stagger: true, variant: 'soft' });
  markReveal('.reviews .section-heading');
  markReveal('.review-card', { stagger: true });
  markReveal('.reviews__action');
  markReveal('.flow .section-heading');
  markReveal('.flow-card', { stagger: true });
  markReveal('.pricing-campaign', { variant: 'soft' });
  markReveal('.pricing .section-heading');
  markReveal('.pricing-visit', { variant: 'soft' });
  markReveal('.price-card', { stagger: true });
  markReveal('.access .section-heading');
  markReveal('.access__map-col', { variant: 'left' });
  markReveal('.access__info', { variant: 'right' });
  markReveal('.news .section-heading');
  markReveal('.news-item', { stagger: true });
  markReveal('.news__action');
  markReveal('.contact .section-heading');
  markReveal('.contact-form', { variant: 'soft' });
  markReveal('.thanks__title');
  markReveal('.thanks__subtitle', { variant: 'soft' });
  markReveal('.thanks__message', { variant: 'soft' });
  markReveal('.thanks__note', { variant: 'soft' });
  markReveal('.thanks__tel', { variant: 'soft' });
  markReveal('.thanks__back', { variant: 'soft' });
  markReveal('.footer__brand', { variant: 'left' });
  markReveal('.footer__nav', { variant: 'right' });
  markReveal('.footer__sns', { variant: 'soft' });

  if (reduceMotion) {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
    document.body.classList.add('is-ready');
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.14,
      rootMargin: '0px 0px -8% 0px',
    }
  );

  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

  requestAnimationFrame(() => {
    document.body.classList.add('is-ready');
  });
});
