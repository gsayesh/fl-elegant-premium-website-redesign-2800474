/* Shared micro-interactions for both concepts. Vanilla JS, no dependencies. */
(function () {
  var root = document.documentElement;
  var embedded = window.self !== window.top || /[?&]static/.test(location.search);
  if (embedded || !('IntersectionObserver' in window)) root.classList.add('no-motion');

  window.addEventListener('load', function () { document.body.classList.add('is-loaded'); });

  // Header state on scroll
  var header = document.querySelector('.header');
  function onScroll() { if (header) header.classList.toggle('is-scrolled', window.scrollY > 24); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // Mobile menu
  var btn = document.querySelector('.menu-btn');
  if (btn) btn.addEventListener('click', function () {
    var open = document.body.classList.toggle('menu-open');
    btn.setAttribute('aria-expanded', open);
  });
  document.querySelectorAll('.mobile-nav a').forEach(function (a) {
    a.addEventListener('click', function () { document.body.classList.remove('menu-open'); });
  });

  // Scroll reveal
  if (!root.classList.contains('no-motion')) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  }

  // Project filter
  var chips = document.querySelectorAll('[data-filter]');
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var f = chip.getAttribute('data-filter');
      chips.forEach(function (c) { c.classList.toggle('is-active', c === chip); c.setAttribute('aria-pressed', c === chip); });
      document.querySelectorAll('[data-cat]').forEach(function (p) {
        p.classList.toggle('is-hidden', f !== 'all' && p.getAttribute('data-cat').indexOf(f) === -1);
      });
    });
  });

  // Testimonials
  document.querySelectorAll('[data-quotes]').forEach(function (wrap) {
    var quotes = wrap.querySelectorAll('.quote');
    var dots = wrap.parentElement.querySelectorAll('.dots button');
    var i = 0, timer;
    function show(n) {
      i = (n + quotes.length) % quotes.length;
      quotes.forEach(function (q, k) { q.classList.toggle('is-active', k === i); });
      dots.forEach(function (d, k) { d.classList.toggle('is-active', k === i); });
    }
    function play() { clearInterval(timer); if (!embedded) timer = setInterval(function () { show(i + 1); }, 6500); }
    dots.forEach(function (d, k) { d.addEventListener('click', function () { show(k); play(); }); });
    show(0); play();
  });

  // Enquiry form: light client-side validation + success state
  document.querySelectorAll('form[data-validate]').forEach(function (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var ok = true;
      form.querySelectorAll('[required]').forEach(function (inp) {
        var field = inp.closest('.field');
        var bad = !inp.value.trim() || (inp.type === 'email' && !/^\S+@\S+\.\S+$/.test(inp.value));
        if (field) field.classList.toggle('is-invalid', bad);
        if (bad) ok = false;
      });
      if (ok) { form.classList.add('is-sent'); form.reset(); }
    });
  });

  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
