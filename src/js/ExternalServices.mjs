const baseURL = import.meta.env.VITE_SERVER_URL || "https://wdd330-backend.onrender.com/";

async function convertToJson(res) {
  const jsonResponse = await res.json();
  if (res.ok) {
    return jsonResponse;
  } else {
    throw { name: "servicesError", message: jsonResponse };
  }
}

export default class ExternalServices {
  async getData(category) {
    const response = await fetch(`${baseURL}products/search/${category}`);
    return convertToJson(response);
  }

  async findProductById(id) {
    const response = await fetch(`${baseURL}product/${id}`);
    return convertToJson(response);
  }

  async checkout(payload) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    };
    const response = await fetch(`${baseURL}checkout`, options);
    return convertToJson(response);
  }
}
