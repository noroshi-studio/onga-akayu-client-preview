/**
 * Opening sequence — shown once per tab session.
 * Add ?intro=1 to the URL to force a replay for review.
 */
(() => {
  'use strict';

  const root = document.documentElement;
  const opening = document.querySelector('[data-onga-opening]');

  if (!opening || !root.classList.contains('onga-intro-pending')) return;

  const skipButton = opening.querySelector('[data-onga-opening-skip]');
  const media = opening.querySelectorAll('[data-onga-opening-image]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const duration = reducedMotion ? 600 : 5400;
  const skipDuration = reducedMotion ? 0 : 480;
  let finished = false;
  let finishTimer;

  const unlockPage = () => {
    document.body.classList.remove('onga-intro-lock');
    document.body.style.removeProperty('overflow');
    document.body.style.removeProperty('touch-action');
  };

  const complete = () => {
    if (finished) return;
    finished = true;
    window.clearTimeout(finishTimer);
    unlockPage();
    opening.setAttribute('aria-hidden', 'true');
    root.classList.remove('onga-intro-pending');
    opening.remove();
  };

  const finish = (immediate = false) => {
    if (finished || opening.classList.contains('is-ending')) return;
    opening.classList.add('is-ending');
    window.setTimeout(complete, immediate ? 0 : skipDuration);
  };

  try {
    sessionStorage.setItem('onga-intro-seen', '1');
  } catch (error) {
    // The sequence may still run; the CSS time limit remains the safety net.
  }

  document.body.classList.add('onga-intro-lock');
  document.body.style.overflow = 'hidden';
  document.body.style.touchAction = 'none';

  // Register the hard stop before any optional event wiring below.
  finishTimer = window.setTimeout(complete, duration);

  skipButton?.addEventListener('click', () => finish());

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') finish();
  });

  let mediaFailed = false;
  media.forEach((image) => {
    image.addEventListener('error', () => finish(), { once: true });
    if (image.complete && image.naturalWidth === 0) mediaFailed = true;
  });

  if (mediaFailed) finish();

  opening.addEventListener('animationend', (event) => {
    if (event.target === opening && !opening.classList.contains('is-ending')) complete();
  });

})();
