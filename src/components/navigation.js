/**
 * NAVIGATION & HUD CONTROLLER
 * Handles responsive mobile menu, scroll-spy active section highlighting,
 * smooth scrolling, and quick-action navigation buttons.
 */

export function initNavigation() {
  const headerEl = document.getElementById('hudHeader');
  const menuToggleBtn = document.getElementById('menuToggleBtn');
  const navLinksContainer = document.getElementById('navLinks');
  const navLinks = document.querySelectorAll('#navLinks a[href^="#"]');
  const sections = document.querySelectorAll('main section[id]');

  // Mobile Menu Toggle
  if (menuToggleBtn && navLinksContainer) {
    menuToggleBtn.addEventListener('click', () => {
      const isOpen = navLinksContainer.classList.toggle('open');
      menuToggleBtn.textContent = isOpen ? '✕' : '☰';
      menuToggleBtn.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navLinksContainer.classList.remove('open');
        menuToggleBtn.textContent = '☰';
        menuToggleBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Scroll Spy & Header Glass Elevation
  const onScroll = () => {
    if (headerEl) {
      headerEl.classList.toggle('scrolled', window.scrollY > 30);
    }

    let currentSectionId = 'home';
    const scrollPos = window.scrollY + 180;

    sections.forEach((sec) => {
      if (scrollPos >= sec.offsetTop) {
        currentSectionId = sec.id;
      }
    });

    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      link.classList.toggle('active', href === `#${currentSectionId}`);
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

