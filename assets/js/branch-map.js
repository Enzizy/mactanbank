/* Mactan Bank — branch locator map (Leaflet + OpenStreetMap, no API key).
   Unlike main.js, this one IS needed in WordPress: paste it with the branch list
   markup into an HTML widget on the Branches page (see README.md).
   Pins come from data-lat / data-lng on each .branch-card. */
(function () {
  'use strict';

  var el = document.querySelector('[data-branch-map]');
  var list = document.querySelector('[data-branch-grid]');
  if (!el || !list || !window.L) return;

  var cards = [].slice.call(list.querySelectorAll('.branch-card'));
  var map = L.map(el, { scrollWheelZoom: false, zoomControl: true });
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);
  // Scroll-zoom only after the map is clicked, so the page still scrolls past it.
  map.on('click', function () { map.scrollWheelZoom.enable(); });
  map.on('mouseout', function () { map.scrollWheelZoom.disable(); });

  var markers = cards.map(function (card) {
    var name = card.querySelector('.branch-card__name').textContent;
    var main = card.classList.contains('branch-card--main');
    var marker = L.marker([+card.dataset.lat, +card.dataset.lng], {
      title: name,
      alt: name,
      zIndexOffset: main ? 500 : 0,
      icon: L.divIcon({
        className: 'map-pin' + (main ? ' map-pin--main' : ''),
        html: '<span><i class="fas fa-university"></i></span>',
        iconSize: [40, 40],
        iconAnchor: [20, 48],
        popupAnchor: [0, -46],
      }),
    }).bindPopup(
      '<h4>' + name + '</h4>' +
      '<p>' + card.querySelector('.branch-card__address').textContent + '</p>' +
      '<a href="' + card.querySelector('.branch-card__directions').href + '" target="_blank" rel="noopener">Get directions →</a>'
    );
    marker.on('click', function () { select(card, false); });
    marker.on('popupclose', function () { if (card.classList.contains('is-active')) setActive(null); });
    return marker;
  });

  function setActive(card) {
    cards.forEach(function (c, i) {
      var on = c === card;
      c.classList.toggle('is-active', on);
      var pin = markers[i].getElement();
      if (pin) pin.classList.toggle('is-active', on);
    });
  }

  // fromList: the visitor clicked a card, so zoom in and bring the map into view.
  function select(card, fromList) {
    var marker = markers[cards.indexOf(card)];
    setActive(card);
    if (fromList) {
      if (window.matchMedia('(max-width: 1024px)').matches) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      map.once('moveend', function () { marker.openPopup(); });
      map.flyTo(marker.getLatLng(), 16, { duration: 0.8 });
    } else {
      list.scrollTo({ top: card.offsetTop - 6, behavior: 'smooth' });
    }
  }

  // Show only the pins whose cards pass the search/region filter, and fit the map to them.
  function fit() {
    var shown = [];
    markers.forEach(function (marker, i) {
      if (cards[i].hidden) { marker.remove(); return; }
      marker.addTo(map);
      shown.push(marker);
    });
    if (shown.length) map.fitBounds(L.featureGroup(shown).getBounds(), { padding: [48, 48], maxZoom: 15 });
  }

  cards.forEach(function (card) {
    card.addEventListener('click', function (e) {
      if (!e.target.closest('a')) select(card, true);
    });
  });
  list.addEventListener('branches:filter', fit);
  fit();

  // Deep link from the home page branch chips, e.g. branches.html#cebu.
  // Runs on load, after the browser's own jump to the anchor.
  var target = location.hash && document.getElementById(location.hash.slice(1));
  if (target && cards.indexOf(target) !== -1) {
    window.addEventListener('load', function () { select(target, true); });
  }
})();
