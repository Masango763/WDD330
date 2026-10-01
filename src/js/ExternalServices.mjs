const baseURL = 'https://wdd330-backend.onrender-osp8.com/';

async function convertToJson(res) {
  const jsonResponse = await res.json();
  if (res.ok) {
    return jsonResponse;
  } else {
    throw { name: 'servicesError', message: jsonResponse };
  }
}

export default class ExternalServices {
  async getData(category) {
    const response = await fetch(`${baseURL}products/search/${category}`);
    return await convertToJson(response);
  }

  async findProductById(id) {
    const response = await fetch(`${baseURL}product/${id}`);
    return await convertToJson(response);
  }

  async checkout(payload) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    };
    const response = await fetch(`${baseURL}checkout`, options);
    return await convertToJson(response);
  }
}
