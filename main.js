// Texas Corners Township — main.js (2026 Revamp)
// Vanilla JS only — no jQuery dependency

document.addEventListener('DOMContentLoaded', function () {

  // ─── Navbar Brand Letter Drop ─────────────────────────────────────
  var brand = document.querySelector('#main-nav .navbar-brand');
  if (brand) {
    var delay = 0.05;
    // Walk child nodes: text nodes and the <span> for "Corners"
    Array.from(brand.childNodes).forEach(function (node) {
      if (node.nodeType === 3) {
        // Plain text node ("Texas ")
        var text = node.textContent;
        var frag = document.createDocumentFragment();
        text.split('').forEach(function (ch) {
          if (ch === ' ') {
            frag.appendChild(document.createTextNode('\u00A0'));
            delay += 0.04;
          } else {
            var s = document.createElement('span');
            s.className = 'nav-brand-letter';
            s.style.animationDelay = delay + 's';
            s.textContent = ch;
            frag.appendChild(s);
            delay += 0.07;
          }
        });
        node.parentNode.replaceChild(frag, node);
      } else if (node.nodeName === 'SPAN') {
        // <span>Corners</span>
        var inner = node.textContent;
        node.textContent = '';
        inner.split('').forEach(function (ch) {
          var s = document.createElement('span');
          s.className = 'nav-brand-letter';
          s.style.animationDelay = delay + 's';
          s.textContent = ch;
          node.appendChild(s);
          delay += 0.07;
        });
      }
    });
  }

  // ─── Hero Title Letter Animation ──────────────────────────────────
  var heroH1 = document.querySelector('.hero-content h1');
  if (heroH1) {
    // "Welcome to" — animate as a single swooping unit
    var firstNode = heroH1.firstChild;
    if (firstNode && firstNode.nodeType === 3 && firstNode.textContent.trim()) {
      var wrapWord = document.createElement('span');
      wrapWord.className = 'hero-word-anim';
      wrapWord.style.animationDelay = '0.15s';
      wrapWord.textContent = firstNode.textContent;
      heroH1.replaceChild(wrapWord, firstNode);
    }
    // "Texas Corners" span — animate letter by letter
    var titleSpan = heroH1.querySelector('span:not(.hero-word-anim)');
    if (titleSpan) {
      var letters = titleSpan.textContent;
      titleSpan.textContent = '';
      var delay = 0.42;
      letters.split('').forEach(function (ch) {
        if (ch === ' ') {
          var sp = document.createElement('span');
          sp.style.display = 'inline-block';
          sp.innerHTML = '&nbsp;';
          titleSpan.appendChild(sp);
          delay += 0.05;
        } else {
          var s = document.createElement('span');
          s.className = 'hero-letter-anim';
          s.style.animationDelay = delay + 's';
          s.textContent = ch;
          titleSpan.appendChild(s);
          delay += 0.068;
        }
      });
    }
  }

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
  const locationsData = Array.isArray(window.TEXAS_CORNERS_LOCATIONS) ? window.TEXAS_CORNERS_LOCATIONS : [];

  document.querySelectorAll('[data-counter-type]').forEach(function (counter) {
    var counterType = counter.getAttribute('data-counter-type');
    var target = 0;

    if (counterType === 'total') {
      target = locationsData.length;
    } else if (counterType) {
      target = locationsData.filter(function (loc) { return loc.type === counterType; }).length;
    }

    if (target > 0) {
      counter.setAttribute('data-target', String(target));
    }
  });

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

  // ─── FAQ Accordion ────────────────────────────────────────────────
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var isOpen = btn.getAttribute('aria-expanded') === 'true';
      var answer = btn.nextElementSibling;

      // Close all others
      document.querySelectorAll('.faq-question').forEach(function (other) {
        other.setAttribute('aria-expanded', 'false');
        var otherAnswer = other.nextElementSibling;
        if (otherAnswer) otherAnswer.classList.remove('open');
      });

      // Toggle current
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        answer.classList.add('open');
      }
    });
  });

  // ─── Hero Search Bar ──────────────────────────────────────────────
  var searchInput  = document.getElementById('hero-search-input');
  var searchResults = document.getElementById('hero-search-results');
  var searchClear  = document.getElementById('hero-search-clear');

  if (searchInput && searchResults) {
    var locations = locationsData;

    var activeIndex = -1;

    function renderResults(query) {
      var q = query.trim().toLowerCase();
      searchResults.innerHTML = '';
      activeIndex = -1;

      if (q.length < 1) {
        searchResults.classList.remove('open');
        return;
      }

      var matches = locations.filter(function (loc) {
        return loc.name.toLowerCase().indexOf(q) !== -1 ||
               loc.cat.toLowerCase().indexOf(q) !== -1;
      }).slice(0, 7);

      if (matches.length === 0) {
        searchResults.innerHTML = '<li class="hs-no-results">No results for "' + query + '"</li>';
        searchResults.classList.add('open');
        return;
      }

      matches.forEach(function (loc, i) {
        var li = document.createElement('li');
        var a  = document.createElement('a');
        a.href = loc.url;
        a.className = 'hs-result-item';
        a.setAttribute('role', 'option');
        a.innerHTML =
          '<img class="hs-result-img" src="' + loc.img + '" alt="" loading="lazy">' +
          '<div class="hs-result-body">' +
            '<div class="hs-result-name">' + loc.name + '</div>' +
            '<div class="hs-result-cat">' + loc.cat + '</div>' +
          '</div>' +
          '<i class="fa-solid fa-arrow-right hs-result-arrow"></i>';
        li.appendChild(a);
        searchResults.appendChild(li);
      });

      searchResults.classList.add('open');
    }

    searchInput.addEventListener('input', function () {
      renderResults(searchInput.value);
      searchClear.style.display = searchInput.value.length > 0 ? 'block' : 'none';
    });

    searchInput.addEventListener('keydown', function (e) {
      var items = searchResults.querySelectorAll('.hs-result-item');
      if (!items.length) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        activeIndex = Math.min(activeIndex + 1, items.length - 1);
        items.forEach(function (el, i) { el.classList.toggle('active', i === activeIndex); });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        activeIndex = Math.max(activeIndex - 1, 0);
        items.forEach(function (el, i) { el.classList.toggle('active', i === activeIndex); });
      } else if (e.key === 'Enter' && activeIndex >= 0) {
        e.preventDefault();
        items[activeIndex].click();
      } else if (e.key === 'Escape') {
        searchResults.classList.remove('open');
        searchInput.blur();
      }
    });

    searchClear.addEventListener('click', function () {
      searchInput.value = '';
      searchClear.style.display = 'none';
      searchResults.classList.remove('open');
      searchInput.focus();
    });

    document.addEventListener('click', function (e) {
      if (!e.target.closest('.hero-search')) {
        searchResults.classList.remove('open');
      }
    });
  }

  // ─── Horizontal Scroll — Shine Gradient on Hover ──────────────
  document.querySelectorAll('.scroll-track .location-card').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width;
      var y = (e.clientY - rect.top)  / rect.height;
      card.style.setProperty('--mx', (x * 100) + '%');
      card.style.setProperty('--my', (y * 100) + '%');
    });
    card.addEventListener('mouseleave', function () {
      card.style.setProperty('--mx', '50%');
      card.style.setProperty('--my', '50%');
    });
  });

  // ─── Horizontal Scroll — Arrow Buttons ────────────────────────
  document.querySelectorAll('.scroll-arrow').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var track = btn.closest('.scroll-row').querySelector('.scroll-track');
      var card  = track.querySelector('.location-card');
      var step  = card ? (card.offsetWidth + 14) * 3 : 300;
      var dir   = btn.classList.contains('arrow-right') ? step : -step;
      track.scrollBy({ left: dir, behavior: 'smooth' });
    });
  });

  // ─── Horizontal Scroll — Drag to Scroll ───────────────────────
  // Only enters drag mode after 6px movement — simple clicks still work
  document.querySelectorAll('.scroll-track').forEach(function (track) {
    var isDown = false, isDragging = false, startX = 0, scrollLeft = 0;

    track.addEventListener('mousedown', function (e) {
      isDown = true;
      isDragging = false;
      startX = e.pageX;
      scrollLeft = track.scrollLeft;
    });

    document.addEventListener('mouseup', function () {
      isDown = false;
      isDragging = false;
      track.classList.remove('is-dragging');
    });

    track.addEventListener('mousemove', function (e) {
      if (!isDown) return;
      var delta = e.pageX - startX;
      if (!isDragging && Math.abs(delta) < 6) return; // threshold — not a drag yet
      isDragging = true;
      track.classList.add('is-dragging');
      e.preventDefault();
      track.scrollLeft = scrollLeft - delta * 1.3;
    });

    // Prevent click navigation after a drag
    track.addEventListener('click', function (e) {
      if (isDragging) e.preventDefault();
    }, true);

    track.addEventListener('touchstart', function (e) {
      startX = e.touches[0].pageX;
      scrollLeft = track.scrollLeft;
    }, { passive: true });
    track.addEventListener('touchmove', function (e) {
      var x = e.touches[0].pageX;
      track.scrollLeft = scrollLeft - (x - startX) * 1.2;
    }, { passive: true });
  });

  // ─── Hero Rotating Tagline & Prompt Carousel ───────────────────
  var taglines = [
    'Discover parks, dining, and local businesses',
    'See what\'s happening around town',
    'Find something good to eat',
    'Browse the town calendar',
    'Explore parks, places, and more',
    'Your local guide to Texas Corners'
  ];
  var prompts = [
    'Hungry? Let\'s find something to eat.',
    'Want to see what\'s going on this week?',
    'Looking for a park or place to explore?',
    'Need the town calendar? It\'s right here.',
    'Discover local spots in just a few taps.'
  ];

  function runCarousel(el, texts, startDelay, interval, transMs) {
    if (!el) return;
    var idx = 0;

    function tick() {
      // Slide out upward
      el.style.transition = 'opacity ' + transMs + 'ms ease, transform ' + transMs + 'ms ease';
      el.style.opacity = '0';
      el.style.transform = 'translateY(-13px)';

      setTimeout(function () {
        idx = (idx + 1) % texts.length;
        el.textContent = texts[idx];

        // Snap to entry position without animating
        el.style.transition = 'none';
        el.style.transform = 'translateY(16px)';

        // Double rAF ensures the browser registers the snap before transitioning in
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            el.style.transition =
              'opacity ' + transMs + 'ms ease, transform ' + transMs + 'ms cubic-bezier(0.22, 1.15, 0.36, 1)';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
          });
        });
      }, transMs);
    }

    // Let CSS entry animation finish, then hand off to JS carousel
    setTimeout(function () {
      el.style.animation = 'none';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
      setInterval(tick, interval);
    }, startDelay);
  }

  runCarousel(document.getElementById('hero-tagline'), taglines, 4200, 3600, 480);
  // Offset prompt slightly so both don't transition at the same moment
  runCarousel(document.getElementById('hero-prompt'),  prompts,  5100, 3600, 420);

  // ─── Search Placeholder Rotation ──────────────────────────────
  var phTexts = [
    'Search parks, food, businesses\u2026',
    'Try \u201ccoffee\u201d, \u201cplayground\u201d, or \u201cpizza\u201d',
    'Search Texas Corners\u2026',
    'Looking for something? Start here\u2026',
    'Search restaurants, parks, and more\u2026'
  ];
  var phIdx = 0;
  var phInput = document.getElementById('hero-search-input');
  if (phInput) {
    setInterval(function () {
      if (document.activeElement !== phInput && !phInput.value) {
        phIdx = (phIdx + 1) % phTexts.length;
        phInput.placeholder = phTexts[phIdx];
      }
    }, 4000);
  }

});
