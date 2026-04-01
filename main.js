// Texas Corners Township — main.js (2026 Revamp)
// Vanilla JS only — no jQuery dependency

document.addEventListener('DOMContentLoaded', function () {

  // ─── Glassmorphism Background Orb ─────────────────────────────────
  const orb = document.createElement('div');
  orb.className = 'orb-cyan';
  document.body.appendChild(orb);

  // ─── Loading Screen ────────────────────────────────────────────────
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    window.addEventListener('load', function () {
      setTimeout(function () {
        loadingScreen.classList.add('fade-out');
        setTimeout(function () { loadingScreen.style.display = 'none'; }, 600);
      }, 800);
    });
  }

  // ─── Scroll Progress Bar ───────────────────────────────────────────
  const progressBar = document.getElementById('scroll-progress');
  if (progressBar) {
    window.addEventListener('scroll', function () {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = progress + '%';
    });
  }

  // ─── Navbar Scroll Effect ──────────────────────────────────────────
  const navbar = document.getElementById('main-nav');
  if (navbar) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // ─── Scroll-Reveal (Intersection Observer) ─────────────────────────
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(function (el) { observer.observe(el); });
  } else {
    // Fallback: show all elements
    revealElements.forEach(function (el) { el.classList.add('active'); });
  }

  // ─── Animated Counters ─────────────────────────────────────────────
  const counters = document.querySelectorAll('.counter');
  if (counters.length > 0 && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-target'), 10);
          const duration = 1800;
          const startTime = performance.now();

          function tick(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(eased * target);
            if (progress < 1) requestAnimationFrame(tick);
            else el.textContent = target;
          }
          requestAnimationFrame(tick);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (c) { counterObserver.observe(c); });
  }

  // ─── Back to Top ───────────────────────────────────────────────────
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    });
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ─── Hash-based scroll on page load ────────────────────────────────
  if (window.location.hash) {
    const target = document.querySelector(window.location.hash);
    if (target) {
      setTimeout(function () {
        target.scrollIntoView({ behavior: 'smooth' });
      }, 600);
    }
  }

  // ─── Stagger card animations ───────────────────────────────────────
  document.querySelectorAll('.cards-grid').forEach(function (grid) {
    const cards = grid.querySelectorAll('.location-card');
    cards.forEach(function (card, i) {
      card.style.transitionDelay = (i * 0.06) + 's';
    });
  });

});
