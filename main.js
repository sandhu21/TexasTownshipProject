// Texas Corners Township — main.js (2026 Revamp)
// Vanilla JS only — no jQuery dependency

document.addEventListener('DOMContentLoaded', function () {

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
    var locations = [
      // Parks & Facilities
      { name: 'Texas Drive Park',          cat: 'Park',     url: '/Parks%20and%20Facilities/texas_drive_park.html',         img: '/Pictures/texas_drive_park.jpg' },
      { name: 'Maple Hill Splash Pad',     cat: 'Park',     url: '/Parks%20and%20Facilities/maple_hill_splash_pad.html',    img: '/Pictures/maple_hill_splash_pad.jpg' },
      { name: '6th Street Park',           cat: 'Park',     url: '/Parks%20and%20Facilities/6th_street_park.html',          img: '/Pictures/6th_street_park.jpg' },
      { name: 'Pocket Park',               cat: 'Park',     url: '/Parks%20and%20Facilities/pocket_park.html',              img: '/Pictures/pocket_park.jpg' },
      { name: 'Texas Township Trailway',   cat: 'Trail',    url: '/Parks%20and%20Facilities/texas_township_trailway.html',  img: '/Pictures/texas_township_trailway.jpg' },
      { name: 'Farmers Market Pavilion',   cat: 'Facility', url: '/Parks%20and%20Facilities/farmers_market_pavilion.html',  img: '/Pictures/farmers_market_provilion.jpg' },
      { name: 'Al Sabo Land Preserve',     cat: 'Preserve', url: '/Parks%20and%20Facilities/al_sabo_land_preserve.html',   img: '/Pictures/al_sabo_land_preserve.jpg' },
      { name: 'Woollam Nature Preserve',   cat: 'Preserve', url: '/Parks%20and%20Facilities/woollam_nature_preserve.html', img: '/Pictures/woollam_nature_preserve.jpg' },
      // Food & Drink
      { name: 'Texas Corners Brewing',     cat: 'Brewery',  url: '/Food/texas_corners_brewing.html',    img: '/Pictures/texas_corners_brewing.jpeg' },
      { name: 'Bold',                      cat: 'Restaurant', url: '/Food/bold.html',                  img: '/Pictures/bold.jpg' },
      { name: 'Gusto',                     cat: 'Restaurant', url: '/Food/gusto.html',                 img: '/Pictures/gusto.jpg' },
      { name: 'Sura Korean BBQ',           cat: 'Restaurant', url: '/Food/sura.html',                  img: '/Pictures/sura.jpg' },
      { name: "Fletcher's Pub",            cat: 'Bar & Grill', url: '/Food/fletchers_pub.html',        img: '/Pictures/fletchers_pub.jpg' },
      { name: "Louie's Corner Bar",        cat: 'Bar',      url: '/Food/louies_corner_bar.html',        img: '/Pictures/louies_corner_bar.webp' },
      { name: 'Holy Taco',                 cat: 'Restaurant', url: '/Food/holy_taco.html',             img: '/Pictures/holy_taco.jpg' },
      { name: 'Hunan Garden',              cat: 'Restaurant', url: '/Food/hunan_garden.html',          img: '/Pictures/hunan_gardens.jpg' },
      { name: 'Rykse & Co',               cat: 'Restaurant', url: '/Food/rykse_and_co.html',           img: '/Pictures/rykse_and_co.webp' },
      { name: "Zeb's Trading Company",    cat: 'Restaurant', url: '/Food/zebs_trading_company.html',   img: '/Pictures/zebs_trading_company.jpg' },
      { name: 'Biggby Coffee',            cat: 'Coffee',   url: '/Food/biggby_coffee.html',             img: '/Pictures/biggby_coffee.jpg' },
      { name: "Hungry Howie's Pizza",     cat: 'Pizza',    url: '/Food/hungry_howies_pizza.html',       img: '/Pictures/hungry_howies_pizza.jpg' },
      // Businesses
      { name: "VS Bogey's & Stogies",     cat: 'Business', url: '/Buisnesses/vs_bogeys_and_stogies.html',              img: '/Pictures/vs_bogeys_and_stogies.jpg' },
      { name: 'Texas Corners Ace Hardware', cat: 'Hardware', url: '/Buisnesses/texas_corners_ace_hardware.html',       img: '/Pictures/texas_corners_ace_hardware.jpg' },
      { name: 'Allure Skin & Beauty',     cat: 'Beauty',   url: '/Buisnesses/allure_skin_and_beauty.html',              img: '/Pictures/allure_skin_and_beauty.jpg' },
      { name: 'Lee & Birch',              cat: 'Boutique', url: '/Buisnesses/lee_and_birch_kalamazoo.html',             img: '/Pictures/lee_and_birch_kalamazoo.jpg' },
      { name: 'The Cheese Lady',          cat: 'Specialty Food', url: '/Buisnesses/the_cheese_lady.html',              img: '/Pictures/the_cheese_lady.jpg' },
      { name: 'Pink Lemonade',            cat: "Children's Boutique", url: '/Buisnesses/pink_lemonade.html',            img: '/Pictures/pink_lemonade.jpg' },
      { name: "Refined Men's Grooming",   cat: 'Grooming', url: '/Buisnesses/refined_mens_grooming.html',              img: '/Pictures/refined_mens_grooming.jpeg' },
      { name: 'VCA Animal Hospital',      cat: 'Veterinary', url: '/Buisnesses/vca_texas_corners_animal_hospital.html', img: '/Pictures/vca_texas_corners_animal_hospital.jpg' },
      { name: 'KLH Custom Homes',         cat: 'Home Builder', url: '/Buisnesses/klh_custom_homes.html',               img: '/Pictures/klh_custom_homes.jpg' },
      { name: "Dave's Glass Service",     cat: 'Glass & Auto', url: '/Buisnesses/daves_glass_service.html',            img: '/Pictures/daves_glass.jpg' },
      { name: 'Citgo',                    cat: 'Gas Station', url: '/Buisnesses/citgo.html',                           img: '/Pictures/citgo.jpg' }
    ];

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
  document.querySelectorAll('.scroll-track').forEach(function (track) {
    var isDown = false, startX = 0, scrollLeft = 0;
    track.addEventListener('mousedown', function (e) {
      isDown = true;
      track.classList.add('is-dragging');
      startX = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
    });
    document.addEventListener('mouseup', function () {
      isDown = false;
      track.classList.remove('is-dragging');
    });
    track.addEventListener('mousemove', function (e) {
      if (!isDown) return;
      e.preventDefault();
      var x = e.pageX - track.offsetLeft;
      track.scrollLeft = scrollLeft - (x - startX) * 1.4;
    });
    track.addEventListener('touchstart', function (e) {
      startX = e.touches[0].pageX;
      scrollLeft = track.scrollLeft;
    }, { passive: true });
    track.addEventListener('touchmove', function (e) {
      var x = e.touches[0].pageX;
      track.scrollLeft = scrollLeft - (x - startX) * 1.2;
    }, { passive: true });
  });

});
