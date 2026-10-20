/* Mactan Bank — Elementor reference interactions.
   Each behaviour below is built into an Elementor widget, so none of this
   script needs to be copied into WordPress (see README.md). */
(function () {
  'use strict';

  var header = document.querySelector('.header');
  var nav = document.querySelector('.nav');
  var toggle = document.querySelector('.nav-toggle');

  // Sticky header shadow (Header → Motion Effects → Sticky).
  function onScroll() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu (Nav Menu widget → Dropdown on Tablet).
  function setNavTop() {
    if (header) document.documentElement.style.setProperty('--nav-top', header.getBoundingClientRect().bottom + 'px');
  }
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      setNavTop();
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open);
      toggle.innerHTML = open ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
      document.body.style.overflow = open ? 'hidden' : '';
    });
    nav.querySelectorAll('.nav__item--has-children > .nav__link').forEach(function (link) {
      link.addEventListener('click', function (e) {
        if (window.matchMedia('(max-width: 1024px)').matches) {
          e.preventDefault();
          link.parentElement.classList.toggle('is-open');
        }
      });
    });
  }

  // Tabs (Nested Tabs widget).
  document.querySelectorAll('[data-tabs]').forEach(function (tabs) {
    var buttons = tabs.querySelectorAll('.tabs__btn');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        buttons.forEach(function (b) {
          var selected = b === btn;
          b.setAttribute('aria-selected', selected);
          document.getElementById(b.getAttribute('aria-controls')).hidden = !selected;
        });
      });
    });
  });

  // Branch search + region filter (optional: Loop Grid + Taxonomy Filter in Elementor Pro).
  var grid = document.querySelector('[data-branch-grid]');
  if (grid) {
    var input = document.querySelector('[data-branch-search]');
    var chips = document.querySelectorAll('[data-region]');
    var empty = document.querySelector('[data-branch-empty]');
    var region = 'all';
    var apply = function () {
      var q = (input.value || '').trim().toLowerCase();
      var shown = 0;
      grid.querySelectorAll('.branch-card').forEach(function (card) {
        var ok = (region === 'all' || card.dataset.region === region) && card.textContent.toLowerCase().indexOf(q) !== -1;
        card.hidden = !ok;
        if (ok) shown++;
      });
      empty.hidden = shown > 0;
    };
    input.addEventListener('input', apply);
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        chips.forEach(function (c) { c.classList.remove('is-active'); c.setAttribute('aria-pressed', 'false'); });
        chip.classList.add('is-active');
        chip.setAttribute('aria-pressed', 'true');
        region = chip.dataset.region;
        apply();
      });
    });
  }

  // Multi-step form (Form widget → "Step" fields).
  document.querySelectorAll('[data-steps]').forEach(function (form) {
    var steps = form.querySelectorAll('.form-step');
    var markers = form.querySelectorAll('.stepper li');
    var prev = form.querySelector('[data-prev]');
    var next = form.querySelector('[data-next]');
    var submit = form.querySelector('[type="submit"]');
    var current = 0;
    var show = function (i) {
      current = Math.max(0, Math.min(steps.length - 1, i));
      steps.forEach(function (s, n) { s.hidden = n !== current; });
      markers.forEach(function (m, n) {
        m.classList.toggle('is-current', n === current);
        m.classList.toggle('is-done', n < current);
      });
      prev.style.visibility = current === 0 ? 'hidden' : 'visible';
      next.hidden = current === steps.length - 1;
      submit.hidden = current !== steps.length - 1;
      form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    prev.addEventListener('click', function () { show(current - 1); });
    next.addEventListener('click', function () { show(current + 1); });
    markers.forEach(function (m, n) { m.querySelector('button').addEventListener('click', function () { show(n); }); });
    steps.forEach(function (s, n) { s.hidden = n !== 0; });
    markers[0].classList.add('is-current');
    prev.style.visibility = 'hidden';
    submit.hidden = true;
  });

  // Reference build: forms never submit.
  document.querySelectorAll('form[data-demo]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      alert('Design reference only — in WordPress this is an Elementor Form widget.');
    });
  });

  // Entrance animations (Motion Effects → Fade In Up).
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px -60px 0px' });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-visible'); });
  }

  // Elementor guide overlay: labels each block with the container/widget to use.
  // The toggle button is hidden for now; set SHOW_GUIDE_BUTTON to true to bring it back.
  // Adding ?guide to any URL still turns the overlay on.
  var SHOW_GUIDE_BUTTON = false;
  var guide = document.createElement('button');
  guide.hidden = !SHOW_GUIDE_BUTTON;
  guide.className = 'guide-toggle';
  guide.type = 'button';
  guide.setAttribute('aria-pressed', 'false');
  guide.innerHTML = '<i class="fab fa-elementor"></i><span>Show Elementor guide</span>';
  guide.addEventListener('click', function () {
    var on = document.body.classList.toggle('show-guide');
    guide.setAttribute('aria-pressed', on);
    guide.querySelector('span').textContent = on ? 'Hide Elementor guide' : 'Show Elementor guide';
    try { localStorage.setItem('mb-guide', on ? '1' : '0'); } catch (e) {}
  });
  document.body.appendChild(guide);
  var wantGuide = /[?&]guide\b/.test(location.search);
  // Only restore the saved state while the button is visible, so the overlay can't get stuck on.
  if (SHOW_GUIDE_BUTTON) {
    try { if (localStorage.getItem('mb-guide') === '1') wantGuide = true; } catch (e) {}
  }
  if (wantGuide) guide.click();
})();
