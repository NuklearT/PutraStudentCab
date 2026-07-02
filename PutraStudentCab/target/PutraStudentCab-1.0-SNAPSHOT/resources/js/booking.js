// ── Load trip data from previous page ──────────────────────
const tripData = JSON.parse(sessionStorage.getItem('tripData') || 'null');

if (!tripData) {
    window.location.href = 'index.html';
}

// ── Dummy driver pool ───────────────────────────────────────
const dummyDrivers = [
    { name: 'Ahmad Zikri', initials: 'AZ', vehicle: 'Perodua Myvi · ABC 1234', eta: '5 min' },
    { name: 'Nur Aisyah', initials: 'NA', vehicle: 'Proton Saga · WMU 5521', eta: '3 min' },
    { name: 'Farid Hakim', initials: 'FH', vehicle: 'Honda City · JPJ 8890', eta: '7 min' }
];
const driver = dummyDrivers[Math.floor(Math.random() * dummyDrivers.length)];

// ── Populate driver/fare/trip info ──────────────────────────
document.getElementById('driverInitials').innerText = driver.initials;
document.getElementById('driverName').innerText = driver.name;
document.getElementById('driverVehicle').innerText = driver.vehicle;
document.getElementById('etaValue').innerText = driver.eta;

document.getElementById('originText').innerText = tripData.originLabel || 'Pickup point';
document.getElementById('destText').innerText = tripData.destLabel || 'Destination point';
document.getElementById('distText').innerText = tripData.distanceKm.toFixed(2);
document.getElementById('durText').innerText = tripData.durationMin.toFixed(1);
document.getElementById('fareText').innerText = tripData.fare.toFixed(2);

// ── Map setup ────────────────────────────────────────────────
const map = L.map('map').setView([
    (tripData.originLat + tripData.destLat) / 2,
    (tripData.originLng + tripData.destLng) / 2
], 13);

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

L.marker([tripData.originLat, tripData.originLng], { icon: originIcon }).addTo(map).bindPopup('Pickup');
L.marker([tripData.destLat, tripData.destLng], { icon: destIcon }).addTo(map).bindPopup('Destination');

fetch(`https://router.project-osrm.org/route/v1/driving/${tripData.originLng},${tripData.originLat};${tripData.destLng},${tripData.destLat}?overview=full&geometries=geojson`)
    .then(r => r.json())
    .then(data => {
        const coords = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
        const routeLine = L.polyline(coords, { color: '#1a5276', weight: 5, opacity: 0.8 }).addTo(map);
        map.fitBounds(routeLine.getBounds(), { padding: [40, 40] });
    });

// ── Confirm button ───────────────────────────────────────────
function confirmBooking() {
    document.getElementById('confirmedBanner').classList.add('visible');
    document.querySelector('.btn-confirm').disabled = true;
    document.querySelector('.btn-confirm').style.opacity = '0.6';
}