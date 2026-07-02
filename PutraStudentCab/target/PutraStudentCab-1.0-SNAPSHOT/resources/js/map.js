// ── Map setup ──────────────────────────────────────────────
const DEFAULT_CENTER = [2.9926, 101.7188]; // Universiti Putra Malaysia, Serdang
const map = L.map('map').setView(DEFAULT_CENTER, 14);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

const originIcon = L.divIcon({
    html: '<div style="background:#27ae60;width:14px;height:14px;border-radius:50%;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.4)"></div>',
    iconSize: [14, 14], iconAnchor: [7, 7], className: ''
});
const destIcon = L.divIcon({
    html: '<div style="background:#e74c3c;width:14px;height:14px;border-radius:50%;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.4)"></div>',
    iconSize: [14, 14], iconAnchor: [7, 7], className: ''
});

// ── State ──────────────────────────────────────────────────
const point = {
    origin: { lat: null, lng: null, label: null, marker: null },
    dest:   { lat: null, lng: null, label: null, marker: null }
};
let routeLine = null;
let lastTrip = null;
const searchTimer = { origin: null, dest: null };

// ── Elements ───────────────────────────────────────────────
const inputEl   = { origin: document.getElementById('originInput'),       dest: document.getElementById('destInput') };
const suggestEl = { origin: document.getElementById('originSuggestions'), dest: document.getElementById('destSuggestions') };
const calcBtn   = document.getElementById('calcBtn');
const bookBtn   = document.getElementById('bookBtn');
const fareResult = document.getElementById('fareResult');

// ── Autocomplete (Nominatim) ─────────────────────────────────
function onSearchInput(which) {
    clearTimeout(searchTimer[which]);
    const query = inputEl[which].value.trim();

    if (query.length < 3) {
        suggestEl[which].innerHTML = '';
        suggestEl[which].classList.remove('open');
        return;
    }

    suggestEl[which].innerHTML = '<div class="suggestion-item loading">Searching…</div>';
    positionDropdown(which);
    suggestEl[which].classList.add('open');

    searchTimer[which] = setTimeout(() => searchPlaces(which, query), 400);
}

function searchPlaces(which, query) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=5&addressdetails=1&q=${encodeURIComponent(query)}`;
    fetch(url, { headers: { 'Accept-Language': 'en' } })
        .then(r => r.json())
        .then(results => renderSuggestions(which, results))
        .catch(() => {
            suggestEl[which].innerHTML = '<div class="suggestion-item no-result">Search failed, try again</div>';
        });
}

function renderSuggestions(which, results) {
    const container = suggestEl[which];
    container.innerHTML = '';

    if (!results || results.length === 0) {
        container.innerHTML = '<div class="suggestion-item no-result">No matches found</div>';
        return;
    }

    results.forEach(r => {
        const item = document.createElement('div');
        item.className = 'suggestion-item';

        const name = document.createElement('div');
        name.className = 'place-name';
        name.textContent = r.display_name.split(',')[0];

        const detail = document.createElement('div');
        detail.className = 'place-detail';
        detail.textContent = r.display_name;

        item.appendChild(name);
        item.appendChild(detail);

        // mousedown fires before the input's blur, so the click registers
        item.addEventListener('mousedown', (e) => {
            e.preventDefault();
            selectPlace(which, parseFloat(r.lat), parseFloat(r.lon), r.display_name);
        });

        container.appendChild(item);
    });
}

function positionDropdown(which) {
    const rect = inputEl[which].getBoundingClientRect();
    const dropdown = suggestEl[which];
    dropdown.style.top = `${rect.bottom + 4}px`;
    dropdown.style.left = `${rect.left}px`;
}

function showDropdown(which) {
    if (suggestEl[which].innerHTML.trim() !== '') {
        positionDropdown(which);
        suggestEl[which].classList.add('open');
    }
}

function hideDropdown(which) {
    // delay so a click on a suggestion item registers before we hide it
    setTimeout(() => suggestEl[which].classList.remove('open'), 150);
}

// ── Selecting a point (from search or map click) ──────────────
function selectPlace(which, lat, lng, label) {
    inputEl[which].value = label;
    suggestEl[which].innerHTML = '';
    suggestEl[which].classList.remove('open');
    setPoint(which, lat, lng, label);
}

function setPoint(which, lat, lng, label) {
    point[which].lat = lat;
    point[which].lng = lng;
    point[which].label = label;

    if (point[which].marker) {
        map.removeLayer(point[which].marker);
    }
    const icon = which === 'origin' ? originIcon : destIcon;
    point[which].marker = L.marker([lat, lng], { icon }).addTo(map).bindPopup(label);

    if (point.origin.lat !== null && point.dest.lat !== null) {
        const bounds = L.latLngBounds(
            [point.origin.lat, point.origin.lng],
            [point.dest.lat, point.dest.lng]
        );
        map.fitBounds(bounds, { padding: [60, 60] });
        calcBtn.disabled = false;
    } else {
        map.setView([lat, lng], 15);
    }
}

// ── Click-to-set points directly on the map ───────────────────
map.on('click', (e) => {
    const which = point.origin.lat === null ? 'origin' : (point.dest.lat === null ? 'dest' : null);
    if (!which) return; // both points already set — use Reset to start over

    inputEl[which].value = 'Locating…';
    reverseGeocode(e.latlng.lat, e.latlng.lng).then(label => {
        inputEl[which].value = label;
        setPoint(which, e.latlng.lat, e.latlng.lng, label);
    });
});

function reverseGeocode(lat, lng) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
    return fetch(url, { headers: { 'Accept-Language': 'en' } })
        .then(r => r.json())
        .then(data => data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`)
        .catch(() => `${lat.toFixed(5)}, ${lng.toFixed(5)}`);
}

// ── Clear / Reset ───────────────────────────────────────────────
function clearPoint(which) {
    if (point[which].marker) {
        map.removeLayer(point[which].marker);
        point[which].marker = null;
    }
    point[which].lat = null;
    point[which].lng = null;
    point[which].label = null;
    inputEl[which].value = '';
    suggestEl[which].innerHTML = '';
    suggestEl[which].classList.remove('open');

    calcBtn.disabled = true;
    bookBtn.disabled = true;
    fareResult.classList.remove('visible');
    lastTrip = null;

    if (routeLine) {
        map.removeLayer(routeLine);
        routeLine = null;
    }
}

function resetSelection() {
    clearPoint('origin');
    clearPoint('dest');
    document.getElementById('distanceLabel').innerText = '—';
    document.getElementById('durationLabel').innerText = '—';
    document.getElementById('fareLabel').innerText = '—';
    map.setView(DEFAULT_CENTER, 14);
}

// ── Fare calculation ───────────────────────────────────────────
function calculateFare() {
    if (point.origin.lat === null || point.dest.lat === null) return;

    calcBtn.disabled = true;
    const originalLabel = calcBtn.textContent;
    calcBtn.textContent = 'Calculating…';

    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/` +
        `${point.origin.lng},${point.origin.lat};${point.dest.lng},${point.dest.lat}` +
        `?overview=full&geometries=geojson`;

    fetch(osrmUrl)
        .then(r => r.json())
        .then(data => {
            if (!data.routes || data.routes.length === 0) {
                throw new Error('No route found between these points');
            }
            const route = data.routes[0];
            const distanceKm = route.distance / 1000;
            const durationMin = route.duration / 60;

            if (routeLine) map.removeLayer(routeLine);
            const coords = route.geometry.coordinates.map(c => [c[1], c[0]]);
            routeLine = L.polyline(coords, { color: '#1a5276', weight: 5, opacity: 0.8 }).addTo(map);
            map.fitBounds(routeLine.getBounds(), { padding: [60, 60] });

            return fetch('api/fare', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    originLat: point.origin.lat,
                    originLng: point.origin.lng,
                    destLat: point.dest.lat,
                    destLng: point.dest.lng,
                    originLabel: point.origin.label,
                    destLabel: point.dest.label,
                    distanceKm: distanceKm,
                    durationMin: durationMin
                })
            })
            .then(r => {
                if (!r.ok) throw new Error('Fare service returned ' + r.status);
                return r.json();
            })
            .then(fareResp => ({ distanceKm, durationMin, fare: fareResp.fare }));
        })
        .then(({ distanceKm, durationMin, fare }) => {
            document.getElementById('distanceLabel').innerText = distanceKm.toFixed(2);
            document.getElementById('durationLabel').innerText = durationMin.toFixed(1);
            document.getElementById('fareLabel').innerText = fare.toFixed(2);
            fareResult.classList.add('visible');

            lastTrip = {
                originLat: point.origin.lat,
                originLng: point.origin.lng,
                destLat: point.dest.lat,
                destLng: point.dest.lng,
                originLabel: point.origin.label,
                destLabel: point.dest.label,
                distanceKm: distanceKm,
                durationMin: durationMin,
                fare: fare
            };

            bookBtn.disabled = false;
        })
        .catch(err => {
            console.error('Fare calculation failed:', err);
            alert('Could not calculate the fare. Please check your connection and try again.');
        })
        .finally(() => {
            calcBtn.disabled = false;
            calcBtn.textContent = originalLabel;
        });
}

// ── Book ride ────────────────────────────────────────────────────
function bookRide() {
    if (!lastTrip) return;
    sessionStorage.setItem('tripData', JSON.stringify(lastTrip));
    window.location.href = 'booking.html';
}