// Retrieve a parameter value from the current URL query string
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

// LocalStorage helper functions
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

// Helper to load template HTML files via fetch
export async function loadTemplate(path) {
  const res = await fetch(path);
  const template = await res.text();
  return template;
}

// Dynamically load header and footer into designated placeholders
export async function loadHeaderFooter() {
  const headerTemplate = await loadTemplate('../public/partials/header.html');
  const footerTemplate = await loadTemplate('../public/partials/footer.html');

  const headerElement = document.querySelector('#main-header');
  const footerElement = document.querySelector('#main-footer');

  if (headerElement) {
    headerElement.innerHTML = headerTemplate;
  }
  if (footerElement) {
    footerElement.innerHTML = footerTemplate;
  }
}
