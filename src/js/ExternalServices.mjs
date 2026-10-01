const baseURL = import.meta.env.VITE_SERVER_URL || "https://wdd330-backend.onrender.com/";

function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}

export default class ExternalServices {
  async getData(category) {
    try {
      const response = await fetch(`${baseURL}products/search/${category}`);
      const data = await convertToJson(response);
      return data.Result || data;
    } catch (error) {
      const res = await fetch(`/json/${category}.json`);
      const data = await convertToJson(res);
      return data;
    }
  }

  async findProductById(id) {
    try {
      const response = await fetch(`${baseURL}product/${id}`);
      const data = await convertToJson(response);
      return data.Result || data;
    } catch (error) {
      const res = await fetch("/json/tents.json");
      const data = await convertToJson(res);
      return data.find((item) => item.Id === id);
    }
  }
}
