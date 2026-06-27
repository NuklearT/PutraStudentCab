// ── MAP INIT ──────────────────────────────────────────────
const map = L.map('map').setView([3.0, 101.7], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// ── STATE ─────────────────────────────────────────────────
let origin = null, dest = null;
let originMarker = null, destMarker = null, routeLine = null;
let distanceKm = 0, durationMin = 0;
let searchTimers = { origin: null, dest: null };

const originIcon = L.divIcon({
    html: '<div style="background:#27ae60;width:14px;height:14px;border-radius:50%;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.4)"></div>',
    iconSize: [14, 14], iconAnchor: [7, 7], className: ''
});
const destIcon = L.divIcon({
    html: '<div style="background:#e74c3c;width:14px;height:14px;border-radius:50%;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.4)"></div>',
    iconSize: [14, 14], iconAnchor: [7, 7], className: ''
});

// ── CLICK-TO-SET FALLBACK ─────────────────────────────────
map.on('click', function(e) {
    if (!origin) {
        setPoint('origin', e.latlng.lat, e.latlng.lng, 'Picked from map');
    } else if (!dest) {
        setPoint('dest', e.latlng.lat, e.latlng.lng, 'Picked from map');
    }
});

// ── SET POINT ─────────────────────────────────────────────
function setPoint(type, lat, lng, label) {
    if (type === 'origin') {
        origin = { lat, lng };
        if (originMarker) map.removeLayer(originMarker);
        originMarker = L.marker([lat, lng], { icon: originIcon })
            .addTo(map).bindPopup('Pickup').openPopup();
        document.getElementById('originInput').value = label;
    } else {
        dest = { lat, lng };
        if (destMarker) map.removeLayer(destMarker);
        destMarker = L.marker([lat, lng], { icon: destIcon })
            .addTo(map).bindPopup('Destination').openPopup();
        document.getElementById('destInput').value = label;
    }

    if (origin && dest) plotRoute();
    updateCalcButton();
}

// ── SEARCH / AUTOCOMPLETE ─────────────────────────────────
function onSearchInput(type) {
    const input = document.getElementById(type === 'origin' ? 'originInput' : 'destInput');
    const query = input.value.trim();
    const suggestionsEl = document.getElementById(type === 'origin' ? 'originSuggestions' : 'destSuggestions');

    clearTimeout(searchTimers[type]);

    if (query.length < 3) {
        suggestionsEl.innerHTML = '';
        suggestionsEl.classList.remove('open');
        return;
    }

    suggestionsEl.innerHTML = '<div class="suggestion-item loading">Searching...</div>';
    suggestionsEl.classList.add('open');

    searchTimers[type] = setTimeout(() => geocode(query, type), 400);
}

function geocode(query, type) {
    const suggestionsEl = document.getElementById(type === 'origin' ? 'originSuggestions' : 'destSuggestions');
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=my&limit=5&addressdetails=1`;

    fetch(url, { headers: { 'Accept-Language': 'en' } })
        .then(r => r.json())
        .then(results => {
            suggestionsEl.innerHTML = '';
            if (!results.length) {
                suggestionsEl.innerHTML = '<div class="suggestion-item no-result">No results found</div>';
                return;
            }
            suggestionsEl.onmousedown = (e) => e.preventDefault();
            results.forEach(item => {
                const parts = item.display_name.split(', ');
                const name = parts.slice(0, 2).join(', ');
                const detail = parts.slice(2).join(', ');

                const div = document.createElement('div');
                div.className = 'suggestion-item';
                div.innerHTML = `<div class="place-name">${name}</div><div class="place-detail">${detail}</div>`;
                div.addEventListener('mousedown', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setPoint(type, parseFloat(item.lat), parseFloat(item.lon), name + (detail ? ', ' + detail : ''));
                    suggestionsEl.classList.remove('open');
                });
                suggestionsEl.appendChild(div);
            });
        })
        .catch(() => {
            suggestionsEl.innerHTML = '<div class="suggestion-item no-result">Search failed. Try again.</div>';
        });
}

function showDropdown(type) {
    const input = document.getElementById(type === 'origin' ? 'originInput' : 'destInput');
    const suggestionsEl = document.getElementById(type === 'origin' ? 'originSuggestions' : 'destSuggestions');
    if (input.value.trim().length >= 3 && suggestionsEl.children.length) {
        suggestionsEl.classList.add('open');
    }
}

function hideDropdown(type) {
    setTimeout(() => {
        document.getElementById(type === 'origin' ? 'originSuggestions' : 'destSuggestions')
            .classList.remove('open');
    }, 150);
}

// ── ROUTE PLOTTING ────────────────────────────────────────
function plotRoute() {
    const url = `https://router.project-osrm.org/route/v1/driving/${origin.lng},${origin.lat};${dest.lng},${dest.lat}?overview=full&geometries=geojson`;
    fetch(url)
        .then(r => r.json())
        .then(data => {
            const route = data.routes[0];
            distanceKm = route.distance / 1000;
            durationMin = route.duration / 60;
            document.getElementById('distanceLabel').innerText = distanceKm.toFixed(2);
            document.getElementById('durationLabel').innerText = durationMin.toFixed(1);

            if (routeLine) map.removeLayer(routeLine);
            const coords = route.geometry.coordinates.map(c => [c[1], c[0]]);
            routeLine = L.polyline(coords, { color: '#1a5276', weight: 5, opacity: 0.8 }).addTo(map);
            map.fitBounds(routeLine.getBounds(), { padding: [40, 40] });

            updateCalcButton();
        });
}

// ── FARE CALCULATION ──────────────────────────────────────
function calculateFare() {
    if (!origin || !dest) return;

    fetch('api/fare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            originLat: origin.lat, originLng: origin.lng,
            destLat: dest.lat, destLng: dest.lng,
            distanceKm, durationMin
        })
    })
    .then(r => r.json())
    .then(data => {
        document.getElementById('fareLabel').innerText = data.fare.toFixed(2);
        document.getElementById('fareResult').classList.add('visible');
    });
}

// ── RESET ─────────────────────────────────────────────────
function resetSelection() {
    origin = null; dest = null; distanceKm = 0; durationMin = 0;
    if (originMarker) { map.removeLayer(originMarker); originMarker = null; }
    if (destMarker)   { map.removeLayer(destMarker);   destMarker = null; }
    if (routeLine)    { map.removeLayer(routeLine);    routeLine = null; }

    document.getElementById('originInput').value = '';
    document.getElementById('destInput').value = '';
    document.getElementById('distanceLabel').innerText = '—';
    document.getElementById('durationLabel').innerText = '—';
    document.getElementById('fareLabel').innerText = '—';
    document.getElementById('fareResult').classList.remove('visible');
    updateCalcButton();
}

// ── HELPERS ───────────────────────────────────────────────
function clearPoint(type) {
    if (type === 'origin') {
        origin = null;
        if (originMarker) { map.removeLayer(originMarker); originMarker = null; }
        document.getElementById('originInput').value = '';
    } else {
        dest = null;
        if (destMarker) { map.removeLayer(destMarker); destMarker = null; }
        document.getElementById('destInput').value = '';
    }
    if (routeLine) { map.removeLayer(routeLine); routeLine = null; }
    document.getElementById('distanceLabel').innerText = '—';
    document.getElementById('durationLabel').innerText = '—';
    document.getElementById('fareResult').classList.remove('visible');
    updateCalcButton();
}

function updateCalcButton() {
    document.getElementById('calcBtn').disabled = !(origin && dest && distanceKm > 0);
}
