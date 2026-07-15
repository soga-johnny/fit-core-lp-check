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
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      closeMenu();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
});
