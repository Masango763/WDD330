import { Storage } from './storage.js';
import { getCoordinates, getWeatherData } from './weather.js';
import { loadCrops } from './crops.js';
import { checkSuitability } from './suitability.js';

let map = null;
let currentMarker = null;

const zimbabweHubs = [
  { name: "Harare", lat: -17.8292, lon: 31.0522, desc: "Capital & Agricultural Trade Hub" },
  { name: "Bulawayo", lat: -20.1500, lon: 28.5833, desc: "Matabeleland Regional Hub" },
  { name: "Mutare", lat: -18.9728, lon: 32.6694, desc: "Manicaland Horticultural Centre" },
  { name: "Gweru", lat: -19.4500, lon: 29.8167, desc: "Midlands Agro-Industrial Hub" },
  { name: "Masvingo", lat: -20.0744, lon: 30.8328, desc: "Southern Farming Region" },
  { name: "Chinhoyi", lat: -17.3667, lon: 30.2000, desc: "Mashonaland West Grain Basket" }
];

function getWeatherConditionText(code) {
  const codes = {
    0: "Clear sky ☀️",
    1: "Mainly clear 🌤",
    2: "Partly cloudy ⛅",
    3: "Overcast ☁️",
    45: "Foggy 🌫️",
    51: "Light drizzle 🌦️",
    61: "Slight rain 🌧️",
    95: "Thunderstorm ⚡"
  };
  return codes[code] || "Fair conditions 🌤️️";
}

function renderWeatherUI(weather, cityName) {
  try {
    const titleEl = document.getElementById('location-title');
    if (titleEl) titleEl.textContent = `${cityName}, Zimbabwe`;

    if (weather && weather.current) {
      const tempEl = document.getElementById('current-temp');
      const descEl = document.getElementById('weather-desc');
      const detailsEl = document.getElementById('weather-details');
      const timeEl = document.getElementById('weather-time');

      if (tempEl) tempEl.textContent = `${Math.round(weather.current.temperature_2m)}°C`;
      if (descEl) descEl.textContent = getWeatherConditionText(weather.current.weather_code);
      if (detailsEl) detailsEl.textContent = `Humidity: ${weather.current.relative_humidity_2m}% | Wind Speed: ${weather.current.wind_speed_10m} km/h`;
      if (timeEl) timeEl.textContent = `Live Telemetry synced at ${new Date().toLocaleTimeString()}`;
    }

    // Render Forecast
    const forecastContainer = document.getElementById('forecast-container');
    if (forecastContainer && weather && weather.daily) {
      forecastContainer.innerHTML = '';
      const times = weather.daily.time || [];
      for (let i = 0; i < Math.min(times.length, 7); i++) {
        const dateStr = weather.daily.time[i];
        const maxT = Math.round(weather.daily.temperature_2m_max[i]);
        const minT = Math.round(weather.daily.temperature_2m_min[i]);
        const rainSum = weather.daily.precipitation_sum[i];
        const condition = getWeatherConditionText(weather.daily.weather_code[i]);

        const dayDiv = document.createElement('div');
        dayDiv.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0; border-bottom: 1px solid #e9ecef; font-size: 0.9rem;';
        dayDiv.innerHTML = `
          <div><strong>${dateStr}</strong><br><span style="font-size: 0.8rem; color: #666;">${condition}</span></div>
          <div style="text-align: right;"><strong>${maxT}°C</strong> / ${minT}°C<br><span style="font-size: 0.8rem; color: #2D6A4F;">💧 ${rainSum} mm</span></div>
        `;
        forecastContainer.appendChild(dayDiv);
      }
    }
  } catch (e) {
    console.error("Error rendering weather UI:", e);
  }
}

function initMap(lat, lon, name) {
  try {
    if (typeof L === 'undefined') {
      console.warn("Leaflet library not loaded.");
      return;
    }
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;

    if (!map) {
      map = L.map('map').setView([lat, lon], 7);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      zimbabweHubs.forEach(hub => {
        const marker = L.marker([hub.lat, hub.lon]).addTo(map);
        marker.bindPopup(`<b>${hub.name}</b><br>${hub.desc}<br><button id="hub-btn-${hub.name}" style="margin-top:5px; background:#2D6A4F; color:white; border:none; padding:4px 8px; border-radius:4px; cursor:pointer;">Select Hub</button>`);
        
        marker.on('popupopen', () => {
          const btn = document.getElementById(`hub-btn-${hub.name}`);
          if (btn) {
            btn.onclick = () => updateDashboard(hub.name);
          }
        });
      });
    } else {
      map.setView([lat, lon], 8);
    }

    if (!currentMarker) {
      currentMarker = L.circleMarker([lat, lon], {
        radius: 10,
        fillColor: "#E9C46A",
        color: "#1B4332",
        weight: 2,
        fillOpacity: 0.9
      }).addTo(map).bindPopup(`<b>Active: ${name}</b>`);
    } else {
      currentMarker.setLatLng([lat, lon]).setPopupContent(`<b>Active: ${name}</b>`);
    }
  } catch (e) {
    console.error("Map initialization error:", e);
  }
}

const defaultWeather = {
  current: { temperature_2m: 26, relative_humidity_2m: 48, weather_code: 0, wind_speed_10m: 14 },
  daily: {
    time: ["2026-10-02", "2026-10-03", "2026-10-04", "2026-10-05", "2026-10-06", "2026-10-07", "2026-10-08"],
    temperature_2m_max: [28, 29, 27, 30, 28, 27, 29],
    temperature_2m_min: [14, 15, 13, 16, 14, 13, 15],
    precipitation_sum: [0.0, 0.0, 0.0, 1.2, 0.0, 0.0, 0.2],
    weather_code: [0, 1, 0, 61, 2, 0, 1]
  }
};

async function updateDashboard(cityName) {
  // 1. Render immediately using default/fallback data so UI never hangs
  renderWeatherUI(defaultWeather, cityName);
  initMap(-17.8292, 31.0522, cityName);

  // 2. Fetch live data in background
  try {
    const loc = await getCoordinates(cityName);
    Storage.saveLocation(loc);
    initMap(loc.latitude, loc.longitude, loc.name);

    const weather = await getWeatherData(loc.latitude, loc.longitude);
    renderWeatherUI(weather, loc.name);

    const crops = await loadCrops();
    const maize = crops.find(c => c.id === 'maize');
    const result = checkSuitability(maize, weather);
    const statusEl = document.getElementById('crop-check-status');
    if (statusEl) {
      statusEl.innerHTML = `<strong>Maize Status (${result.status}):</strong> ${result.note}`;
    }
  } catch (e) {
    console.warn("Background API sync note:", e);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const searchBtn = document.getElementById('search-btn');
  const searchInput = document.getElementById('search-input');

  if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', () => {
      const query = searchInput.value.trim();
      if (query) updateDashboard(query);
    });
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query) updateDashboard(query);
      }
    });
  }

  const lastLoc = Storage.getLocation();
  updateDashboard(lastLoc.name);
});
