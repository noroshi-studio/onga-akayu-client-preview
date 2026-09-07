/**
 * 遠賀川温泉 おんがの赤湯 — static preview interactions
 * No external dependency. Content remains readable when JavaScript is disabled.
 */
(() => {
  'use strict';

  const root = document.documentElement;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Theme: stored preference takes priority, otherwise follow the operating system.
  const themeButton = document.querySelector('[data-theme-toggle]');
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');

  const getStoredTheme = () => {
    try {
      return localStorage.getItem('onga-theme');
    } catch (error) {
      return null;
    }
  };

  const applyTheme = (theme, persist = false) => {
    const isDark = theme === 'dark';
    root.dataset.theme = isDark ? 'dark' : 'light';
    if (themeButton) {
      themeButton.setAttribute('aria-pressed', String(isDark));
      themeButton.setAttribute('aria-label', `${isDark ? 'ライト' : 'ダーク'}モードに切り替える`);
    }
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', isDark ? '#17262d' : '#efe8d6');
    if (persist) {
      try {
        localStorage.setItem('onga-theme', theme);
      } catch (error) {}
    }
  };

  const storedTheme = getStoredTheme();
  applyTheme(storedTheme || (systemTheme.matches ? 'dark' : 'light'));

  themeButton?.addEventListener('click', () => {
    applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark', true);
  });

  systemTheme.addEventListener?.('change', (event) => {
    if (!getStoredTheme()) applyTheme(event.matches ? 'dark' : 'light');
  });

  // Mobile navigation with Escape/outside-link closing and focus return.
  const menuButton = document.querySelector('[data-menu-button]');
  const menu = document.querySelector('[data-menu]');

  const setMenu = (open, returnFocus = false) => {
    if (!menuButton || !menu) return;
    menuButton.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    if (returnFocus) menuButton.focus();
  };

  menuButton?.addEventListener('click', () => {
    setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
  });

  menu?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenu(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu?.classList.contains('is-open')) setMenu(false, true);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 840) setMenu(false);
  });

  // Header state.
  const header = document.querySelector('[data-header]');
  let headerTicking = false;
  const updateHeader = () => {
    header?.classList.toggle('is-scrolled', window.scrollY > 28);
    headerTicking = false;
  };
  window.addEventListener('scroll', () => {
    if (!headerTicking) {
      requestAnimationFrame(updateHeader);
      headerTicking = true;
    }
  }, { passive: true });
  updateHeader();

  // Reveal animations. Items are visible by default and only enhanced with JS.
  const revealItems = document.querySelectorAll('[data-reveal]');
  if (reducedMotion.matches || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -9% 0px', threshold: 0.08 });
    revealItems.forEach((item) => revealObserver.observe(item));
  }

  // Gradually move the water section from clear-water tint to iron-red tint.
  const waterStory = document.querySelector('[data-water-story]');
  let waterTicking = false;
  const updateWaterProgress = () => {
    if (!waterStory) return;
    const rect = waterStory.getBoundingClientRect();
    const travel = window.innerHeight + rect.height;
    const progress = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / travel));
    waterStory.style.setProperty('--water-progress', reducedMotion.matches ? '1' : progress.toFixed(3));
    waterTicking = false;
  };
  window.addEventListener('scroll', () => {
    if (!waterTicking) {
      requestAnimationFrame(updateWaterProgress);
      waterTicking = true;
    }
  }, { passive: true });
  updateWaterProgress();

  // Accessible FAQ accordion: native buttons retain standard keyboard behavior.
  document.querySelectorAll('[data-accordion] button[aria-controls]').forEach((button) => {
    button.addEventListener('click', () => {
      const panel = document.getElementById(button.getAttribute('aria-controls'));
      if (!panel) return;
      const willOpen = button.getAttribute('aria-expanded') !== 'true';
      button.setAttribute('aria-expanded', String(willOpen));
      panel.hidden = !willOpen;
    });
  });
})();
