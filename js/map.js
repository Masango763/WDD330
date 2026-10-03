export function initMap(lat, lon, locationName) {
  const mapContainer = document.getElementById('map-container');
  if (!mapContainer) return;

  if (!window.agriMap) {
    window.agriMap = L.map('map-container').setView([lat, lon], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(window.agriMap);

    window.agriMarker = L.marker([lat, lon]).addTo(window.agriMap)
      .bindPopup(`<b>${locationName}</b><br>Lat: ${lat}, Lon: ${lon}`).openPopup();
  } else {
    window.agriMap.setView([lat, lon], 10);
    window.agriMarker.setLatLng([lat, lon])
      .setPopupContent(`<b>${locationName}</b><br>Lat: ${lat}, Lon: ${lon}`)
      .openPopup();
  }

  setTimeout(() => {
    window.agriMap.invalidateSize();
  }, 250);
}
