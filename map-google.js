(function () {
  var locations = Array.isArray(window.TEXAS_CORNERS_LOCATIONS) ? window.TEXAS_CORNERS_LOCATIONS : [];
  var config = window.TEXAS_CORNERS_MAP_CONFIG || {};
  var cacheKey = 'texasCornersGoogleGeocodeCacheV1';
  var geocodeDelayMs = 220;
  var state = {
    map: null,
    geocoder: null,
    markers: [],
    pins: [],
    listItems: [],
    activeFilters: new Set(),
    selectedIndex: -1,
    searchQuery: '',
    cache: loadCache()
  };

  var ui = {};

  var typeMeta = {
    food: { label: 'Food & Drink', color: '#e68a00', glyph: 'F' },
    business: { label: 'Business', color: '#2962ff', glyph: 'B' },
    park: { label: 'Park', color: '#118a4b', glyph: 'P' }
  };

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    ui.mapCanvas = document.getElementById('google-map');
    ui.mapNotice = document.getElementById('map-notice');
    ui.status = document.getElementById('map-status');
    ui.count = document.getElementById('sidebar-count');
    ui.search = document.getElementById('map-search');
    ui.clear = document.getElementById('search-clear');
    ui.clearFilters = document.getElementById('filter-clear');
    ui.list = document.getElementById('map-list');
    ui.detail = document.getElementById('location-detail');
    ui.filters = Array.prototype.slice.call(document.querySelectorAll('.map-filter'));

    bindUi();
    renderLocationList();
    updateVisibleState();

    if (!config.apiKey) {
      renderNotice(
        'Google Maps is ready in the code, but the API key is not configured yet. Add your restricted browser key in /map-config.js and enable Maps JavaScript API plus Geocoding API.'
      );
      updateStatus('Awaiting Google Maps API key');
      return;
    }

    updateStatus('Loading Google Maps');
    loadGoogleMaps();
  }

  function bindUi() {
    ui.search.addEventListener('input', function () {
      state.searchQuery = ui.search.value.trim().toLowerCase();
      ui.clear.classList.toggle('visible', state.searchQuery.length > 0);
      updateVisibleState();
    });

    ui.clear.addEventListener('click', function () {
      ui.search.value = '';
      state.searchQuery = '';
      ui.clear.classList.remove('visible');
      updateVisibleState();
      ui.search.focus();
    });

    ui.filters.forEach(function (button) {
      button.addEventListener('click', function () {
        var type = button.getAttribute('data-filter');
        if (state.activeFilters.has(type)) {
          state.activeFilters.delete(type);
          button.classList.remove('active');
        } else {
          state.activeFilters.add(type);
          button.classList.add('active');
        }
        ui.clearFilters.classList.toggle('visible', state.activeFilters.size > 0);
        updateVisibleState();
      });
    });

    ui.clearFilters.addEventListener('click', function () {
      state.activeFilters.clear();
      ui.filters.forEach(function (button) { button.classList.remove('active'); });
      ui.clearFilters.classList.remove('visible');
      updateVisibleState();
    });
  }

  function renderLocationList() {
    ui.list.innerHTML = '';
    state.listItems = [];

    ['park', 'food', 'business'].forEach(function (type) {
      var header = document.createElement('div');
      header.className = 'map-group-heading';
      header.textContent = typeMeta[type].label;
      header.setAttribute('data-group', type);
      ui.list.appendChild(header);

      locations.forEach(function (location, index) {
        if (location.type !== type) return;

        var button = document.createElement('button');
        button.type = 'button';
        button.className = 'map-list-item';
        button.setAttribute('data-index', String(index));
        button.setAttribute('data-type', location.type);
        button.setAttribute('data-name', (location.name + ' ' + location.cat + ' ' + (location.address || '')).toLowerCase());
        button.innerHTML =
          '<span class="map-list-marker map-list-marker--' + location.type + '">' + typeMeta[location.type].glyph + '</span>' +
          '<span class="map-list-copy">' +
            '<span class="map-list-name">' + location.name + '</span>' +
            '<span class="map-list-meta">' + location.cat + '</span>' +
            '<span class="map-list-address">' + (location.address || 'Texas Corners, MI') + '</span>' +
          '</span>' +
          '<span class="map-list-chevron"><i class="fa-solid fa-chevron-right"></i></span>';

        button.addEventListener('click', function () {
          selectLocation(index, true);
        });

        state.listItems[index] = button;
        ui.list.appendChild(button);
      });
    });
  }

  function renderDetail(location, index) {
    var mapsQuery = encodeURIComponent(location.address || (location.name + ' Texas Corners MI'));
    ui.detail.innerHTML =
      '<div class="detail-badge detail-badge--' + location.type + '">' + typeMeta[location.type].label + '</div>' +
      '<h2 class="detail-title">' + location.name + '</h2>' +
      '<p class="detail-subtitle">' + location.cat + '</p>' +
      '<p class="detail-address"><i class="fa-solid fa-location-dot"></i> ' + (location.address || 'Texas Corners, MI') + '</p>' +
      '<div class="detail-actions">' +
        '<a class="detail-btn detail-btn--primary" href="' + location.url + '">Open Page</a>' +
        '<a class="detail-btn" href="https://www.google.com/maps/search/?api=1&query=' + mapsQuery + '" target="_blank" rel="noopener">Directions</a>' +
      '</div>' +
      '<button type="button" class="detail-secondary" data-focus-index="' + index + '">Center On Map</button>';

    var focusButton = ui.detail.querySelector('[data-focus-index]');
    if (focusButton) {
      focusButton.addEventListener('click', function () {
        selectLocation(index, true);
      });
    }
  }

  function selectLocation(index, panMap) {
    var location = locations[index];
    if (!location) return;

    state.selectedIndex = index;
    state.listItems.forEach(function (item, itemIndex) {
      if (!item) return;
      item.classList.toggle('active', itemIndex === index);
    });

    state.pins.forEach(function (pin, pinIndex) {
      if (!pin) return;
      pin.classList.toggle('is-active', pinIndex === index);
    });

    renderDetail(location, index);

    if (state.map && state.markers[index] && panMap) {
      state.map.panTo(state.markers[index].position);
      if (state.map.getZoom() < 16) {
        state.map.setZoom(16);
      }
    }
  }

  function loadGoogleMaps() {
    if (window.google && window.google.maps) {
      initializeGoogleMap();
      return;
    }

    window.__initTexasCornersGoogleMap = initializeGoogleMap;

    var script = document.createElement('script');
    script.src =
      'https://maps.googleapis.com/maps/api/js?key=' + encodeURIComponent(config.apiKey) +
      '&v=weekly&loading=async&libraries=marker' +
      '&callback=__initTexasCornersGoogleMap' +
      '&language=' + encodeURIComponent(config.language || 'en') +
      '&region=' + encodeURIComponent(config.region || 'US') +
      (config.mapId ? '&map_ids=' + encodeURIComponent(config.mapId) : '');
    script.async = true;
    script.defer = true;
    script.onerror = function () {
      renderNotice('Google Maps failed to load. Recheck the API key, referrer restrictions, and enabled APIs.');
      updateStatus('Google Maps failed to load');
    };
    document.head.appendChild(script);
  }

  async function initializeGoogleMap() {
    try {
      var mapsLib = await google.maps.importLibrary('maps');
      var markerLib = await google.maps.importLibrary('marker');

      state.geocoder = new google.maps.Geocoder();
      state.map = new mapsLib.Map(ui.mapCanvas, {
        center: { lat: 42.213, lng: -85.687 },
        zoom: 13,
        mapId: config.mapId || 'DEMO_MAP_ID',
        fullscreenControl: false,
        streetViewControl: false,
        mapTypeControl: false,
        gestureHandling: 'greedy'
      });

      renderNotice('');
      createMarkers(markerLib.AdvancedMarkerElement, markerLib.PinElement);
      applyCachedCoordinates();
      updateVisibleState();
      updateStatus('Google Maps ready');
      geocodeSequentially();
    } catch (error) {
      renderNotice('Google Maps loaded, but the map could not initialize. Confirm your map ID and enabled APIs.');
      updateStatus('Map initialization failed');
    }
  }

  function createMarkers(AdvancedMarkerElement, PinElement) {
    locations.forEach(function (location, index) {
      var meta = typeMeta[location.type];
      var pin = new PinElement({
        background: meta.color,
        borderColor: '#ffffff',
        glyphColor: '#ffffff',
        glyph: meta.glyph,
        scale: 1.05
      });

      pin.element.classList.add('tc-advanced-marker');

      var marker = new AdvancedMarkerElement({
        map: state.map,
        position: { lat: location.lat, lng: location.lng },
        title: location.name,
        content: pin.element
      });

      marker.addListener('gmp-click', function () {
        selectLocation(index, true);
      });

      state.markers[index] = marker;
      state.pins[index] = pin.element;
    });
  }

  function applyCachedCoordinates() {
    locations.forEach(function (location, index) {
      if (!location.address) return;
      var cached = state.cache[location.address.toLowerCase()];
      if (!cached) return;
      updateMarkerPosition(index, cached.lat, cached.lng);
    });
  }

  async function geocodeSequentially() {
    var unresolved = locations.filter(function (location) {
      return !!location.address && !state.cache[location.address.toLowerCase()];
    }).length;

    if (unresolved < 1) {
      updateVisibleState();
      return;
    }

    updateStatus('Verifying ' + unresolved + ' addresses');

    for (var index = 0; index < locations.length; index++) {
      var location = locations[index];
      if (!location.address) continue;

      var cacheId = location.address.toLowerCase();
      if (state.cache[cacheId]) {
        continue;
      }

      try {
        var result = await geocodeAddress(location.address);
        if (result) {
          state.cache[cacheId] = result;
          saveCache(state.cache);
          updateMarkerPosition(index, result.lat, result.lng);
          updateVisibleState();
        }
      } catch (error) {
        updateStatus('Some addresses could not be verified');
      }

      unresolved--;
      if (unresolved > 0) {
        updateStatus('Verifying ' + unresolved + ' addresses');
      }

      await wait(geocodeDelayMs);
    }

    updateStatus('All visible markers loaded');
  }

  function geocodeAddress(address) {
    return new Promise(function (resolve) {
      state.geocoder.geocode({ address: address }, function (results, status) {
        if (status === 'OK' && results && results[0] && results[0].geometry && results[0].geometry.location) {
          resolve({
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng()
          });
          return;
        }
        resolve(null);
      });
    });
  }

  function updateMarkerPosition(index, lat, lng) {
    var marker = state.markers[index];
    if (!marker) return;

    marker.position = { lat: lat, lng: lng };
  }

  function updateVisibleState() {
    var visibleCount = 0;
    var visiblePositions = [];

    state.listItems.forEach(function (item, index) {
      if (!item) return;
      var location = locations[index];
      var matchesFilter = state.activeFilters.size === 0 || state.activeFilters.has(location.type);
      var matchesSearch = state.searchQuery === '' || item.getAttribute('data-name').indexOf(state.searchQuery) !== -1;
      var visible = matchesFilter && matchesSearch;

      item.classList.toggle('hidden', !visible);
      if (state.markers[index]) {
        state.markers[index].map = visible && state.map ? state.map : null;
      }

      if (visible && state.markers[index]) {
        visibleCount++;
        visiblePositions.push(state.markers[index].position);
      }
    });

    document.querySelectorAll('[data-group]').forEach(function (groupHeading) {
      var groupType = groupHeading.getAttribute('data-group');
      var hasVisible = state.listItems.some(function (item, index) {
        return item &&
          !item.classList.contains('hidden') &&
          locations[index] &&
          locations[index].type === groupType;
      });
      groupHeading.classList.toggle('hidden', !hasVisible);
    });

    ui.count.textContent = visibleCount + ' location' + (visibleCount === 1 ? '' : 's');

    if (state.map && visiblePositions.length > 1) {
      var bounds = new google.maps.LatLngBounds();
      visiblePositions.forEach(function (position) { bounds.extend(position); });
      state.map.fitBounds(bounds, 64);
    } else if (state.map && visiblePositions.length === 1 && state.selectedIndex === -1) {
      state.map.setCenter(visiblePositions[0]);
      state.map.setZoom(15);
    }
  }

  function renderNotice(message) {
    ui.mapNotice.innerHTML = message
      ? '<div class="map-notice-card"><h2>Map Setup</h2><p>' + message + '</p><p class="map-notice-help">Recommended setup: a restricted browser key, Google Maps JavaScript API, and Geocoding API.</p></div>'
      : '';
    ui.mapNotice.classList.toggle('is-visible', !!message);
  }

  function updateStatus(message) {
    ui.status.textContent = message;
  }

  function loadCache() {
    try {
      return JSON.parse(localStorage.getItem(cacheKey) || '{}');
    } catch (error) {
      return {};
    }
  }

  function saveCache(cache) {
    try {
      localStorage.setItem(cacheKey, JSON.stringify(cache));
    } catch (error) {
      /* Ignore cache persistence failures. */
    }
  }

  function wait(ms) {
    return new Promise(function (resolve) {
      window.setTimeout(resolve, ms);
    });
  }
})();
