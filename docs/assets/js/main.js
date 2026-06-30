(function () {
  'use strict';

  // ─── Header scroll ──────────────────────────────────────────
  var header = document.getElementById('site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ─── Active nav link ─────────────────────────────────────────
  var path = window.location.pathname;
  document.querySelectorAll('[data-nav-link]').forEach(function (link) {
    var href = link.getAttribute('href');
    var isActive = href === '/'
      ? (path === '/' || path === '/index.html')
      : path.startsWith(href);
    if (isActive) {
      link.classList.remove('text-white\\/70');
      link.classList.add('text-white');
      var bar = link.querySelector('.nav-active-bar');
      if (bar) bar.classList.remove('hidden');
    }
  });

  document.querySelectorAll('.mobile-nav-link').forEach(function (link) {
    var href = link.getAttribute('href');
    var isActive = href === '/'
      ? (path === '/' || path === '/index.html')
      : path.startsWith(href);
    if (isActive) link.classList.add('active');
  });

  // ─── Mobile menu ─────────────────────────────────────────────
  var menuBtn     = document.getElementById('mobile-menu-btn');
  var menuClose   = document.getElementById('mobile-menu-close');
  var menuDrawer  = document.getElementById('mobile-menu-drawer');
  var menuOverlay = document.getElementById('mobile-menu-overlay');

  function openMenu() {
    if (!menuDrawer || !menuOverlay) return;
    menuDrawer.classList.add('is-open');
    menuOverlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    if (!menuDrawer || !menuOverlay) return;
    menuDrawer.classList.remove('is-open');
    menuOverlay.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  if (menuBtn)     menuBtn.addEventListener('click', openMenu);
  if (menuClose)   menuClose.addEventListener('click', closeMenu);
  if (menuOverlay) menuOverlay.addEventListener('click', closeMenu);

  document.querySelectorAll('.mobile-nav-link').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // ─── Reveal animations ───────────────────────────────────────
  var revealObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '-60px 0px' });

  document.querySelectorAll('.reveal').forEach(function (el) {
    revealObs.observe(el);
  });

  // ─── Counter animation ───────────────────────────────────────
  var counterObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el       = entry.target;
      var to       = parseInt(el.dataset.counterTo, 10);
      var suffix   = el.dataset.counterSuffix || '';
      var duration = 1400;
      var start    = performance.now();
      function tick(now) {
        var progress = Math.min((now - start) / duration, 1);
        var eased    = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(to * eased).toLocaleString() + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      counterObs.unobserve(el);
    });
  }, { threshold: 0.4 });

  document.querySelectorAll('[data-counter-to]').forEach(function (el) {
    counterObs.observe(el);
  });

  // ─── Footer year ─────────────────────────────────────────────
  var yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ─── Accordion ───────────────────────────────────────────────
  document.querySelectorAll('.accordion-trigger').forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      var expanded = trigger.getAttribute('aria-expanded') === 'true';
      var accordion = trigger.closest('.accordion');
      if (accordion) {
        accordion.querySelectorAll('.accordion-trigger').forEach(function (t) {
          t.setAttribute('aria-expanded', 'false');
          var c = document.getElementById(t.getAttribute('aria-controls'));
          if (c) c.classList.remove('open');
        });
      }
      if (!expanded) {
        trigger.setAttribute('aria-expanded', 'true');
        var content = document.getElementById(trigger.getAttribute('aria-controls'));
        if (content) content.classList.add('open');
      }
    });
  });

  // ─── Lucide icons ────────────────────────────────────────────
  if (typeof lucide !== 'undefined') lucide.createIcons();
})();
