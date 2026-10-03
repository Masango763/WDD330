export const Storage = {
  saveLocation(loc) {
    localStorage.setItem('agripulse_location', JSON.stringify(loc));
  },
  getLocation() {
    const stored = localStorage.getItem('agripulse_location');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error("Error parsing stored location", e);
      }
    }
    return { name: "Harare", country: "Zimbabwe", latitude: -17.8292, longitude: 31.0522 };
  }
};
