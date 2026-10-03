export async function convertToJson(res) {
  const data = await res.json();
  if (res.ok) return data;
  else throw { name: "apiError", message: data.reason || "Failed to fetch external data." };
}

export async function getGeoCoordinates(locationName) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(locationName)}&count=5&language=en&format=json`;
  const response = await fetch(url);
  const data = await convertToJson(response);
  if (!data.results || data.results.length === 0) {
    throw new Error(`Location "${locationName}" not found.`);
  }
  return data.results;
}

export async function getWeatherForecast(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,etO_fao_evapotranspiration&timezone=Africa%2FHarare`;
  const response = await fetch(url);
  return await convertToJson(response);
}

export async function getNasaPowerClimate(lat, lon, startDate, endDate) {
  const url = `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=PRECTOTCORR,T2M,T2M_MAX,T2M_MIN,RH2M,ALLSKY_SFC_SW_DWN&community=AG&longitude=${lon}&latitude=${lat}&start=${startDate}&end=${endDate}&format=JSON`;
  const response = await fetch(url);
  return await convertToJson(response);
}
