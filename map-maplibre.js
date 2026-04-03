(function () {
  var locations = Array.isArray(window.TEXAS_CORNERS_LOCATIONS) ? window.TEXAS_CORNERS_LOCATIONS : [];
  var state = {
    map: null,
    listItems: [],
    activeFilters: new Set(),
    selectedIndex: -1,
    searchQuery: ''
  };

  var ui = {};

  var typeMeta = {
    food: { label: 'Food & Drink', color: '#e68a00', glyph: 'F' },
    business: { label: 'Business', color: '#2962ff', glyph: 'B' },
    park: { label: 'Park', color: '#118a4b', glyph: 'P' }
  };

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    ui.mapCanvas = document.getElementById('open-map');
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
    initializeMap();
    updateVisibleState();
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

  function initializeMap() {
    state.map = new maplibregl.Map({
      container: ui.mapCanvas,
      style: 'https://tiles.openfreemap.org/styles/liberty',
      center: [-85.687, 42.213],
      zoom: 13,
      attributionControl: true
    });

    state.map.scrollZoom.disable();
    state.map.addControl(new maplibregl.NavigationControl({ visualizePitch: false }), 'top-right');

    state.map.on('load', function () {
      fitVisibleMarkers();
      updateStatus('Click a place to zoom');
    });
  }

  function selectLocation(index, panMap) {
    var location = locations[index];
    if (!location) return;

    state.selectedIndex = index;

    state.listItems.forEach(function (item, itemIndex) {
      if (!item) return;
      item.classList.toggle('active', itemIndex === index);
    });

    renderDetail(location, index);

    if (state.map && panMap) {
      state.map.flyTo({
        center: [location.lng, location.lat],
        zoom: 17,
        speed: 0.9,
        essential: true
      });
    }
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

  function updateVisibleState() {
    var visibleCount = 0;

    state.listItems.forEach(function (item, index) {
      if (!item) return;
      var location = locations[index];
      var matchesFilter = state.activeFilters.size === 0 || state.activeFilters.has(location.type);
      var matchesSearch = state.searchQuery === '' || item.getAttribute('data-name').indexOf(state.searchQuery) !== -1;
      var visible = matchesFilter && matchesSearch;

      item.classList.toggle('hidden', !visible);

      if (visible) {
        visibleCount++;
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
    if (state.map) {
      fitVisibleMarkers();
    }
  }

  function fitVisibleMarkers() {
    var visibleLocations = locations.reduce(function (items, location, index) {
      if (state.listItems[index] && !state.listItems[index].classList.contains('hidden')) {
        items.push(location);
      }
      return items;
    }, []);

    if (visibleLocations.length > 1) {
      var bounds = new maplibregl.LngLatBounds();
      visibleLocations.forEach(function (location) {
        bounds.extend([location.lng, location.lat]);
      });
      state.map.fitBounds(bounds, { padding: 64, maxZoom: 15, duration: 0 });
    } else if (visibleLocations.length === 1 && state.selectedIndex === -1) {
      state.map.jumpTo({
        center: [visibleLocations[0].lng, visibleLocations[0].lat],
        zoom: 15
      });
    }
  }

  function updateStatus(message) {
    ui.status.textContent = message;
  }
})();
