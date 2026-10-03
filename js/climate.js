import { fetchJSON } from './api.js';

export async function getNasaPowerClimate(lat, lon) {
  const url = `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=PRECTOTCORR,T2M&community=AG&longitude=${lon}&latitude=${lat}&start=20260901&end=20260930&format=JSON`;
  return await fetchJSON(url);
}
