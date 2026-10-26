// public/js/effects.js — Foodly Lightweight UI Engine
// Optimized for lightning-fast 60fps performance without 3D lag or cursor overrides.
(function () {
  'use strict';

  // Ensure any old legacy cursor elements are removed from DOM
  const oldCursor = document.getElementById('foodly-cursor');
  const oldRing = document.getElementById('foodly-cursor-ring');
  const oldFloat = document.getElementById('floating-food-container');
  const oldDiya = document.getElementById('navratri-diya-widget');
  if (oldCursor) oldCursor.remove();
  if (oldRing) oldRing.remove();
  if (oldFloat) oldFloat.remove();
  if (oldDiya) oldDiya.remove();

  // 1. Slim & Fast Scroll Progress Bar
  let progressBar = document.getElementById('scroll-progress');
  if (!progressBar) {
    progressBar = document.createElement('div');
    progressBar.id = 'scroll-progress';
    progressBar.style.width = '0%';
    document.body.appendChild(progressBar);
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrolled = window.scrollY;
        const total = document.documentElement.scrollHeight - window.innerHeight;
        const pct = total > 0 ? Math.min(100, Math.round((scrolled / total) * 100)) : 0;
        progressBar.style.width = pct + '%';
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // 2. Micro-bounce on Add to Cart
  window.foodlyPopCart = function () {
    const navCartBtn = document.getElementById('nav-cart-btn');
    if (navCartBtn) {
      navCartBtn.classList.add('scale-110');
      setTimeout(() => navCartBtn.classList.remove('scale-110'), 200);
    }
  };
})();
