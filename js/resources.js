import { fetchJSON } from './api.js';

export async function loadResources() {
  return await fetchJSON('./data/resources.json');
}
