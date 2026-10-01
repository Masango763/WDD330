// wrapper for querySelector
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// set a listener for onclick/ontouch
export function setClick(selector, callback) {
  const el = qs(selector);
  if (el) {
    el.addEventListener("touchend", (event) => {
      event.preventDefault();
      callback();
    });
    el.addEventListener("click", callback);
  }
}

export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

export function renderListWithTemplate(templateFn, parentElement, list, position = "afterbegin", clear = false) {
  if (clear) {
    parentElement.innerHTML = "";
  }
  const htmlStrings = list.map(templateFn);
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

export function renderWithTemplate(template, parentElement, data, callback) {
  if (parentElement) {
    parentElement.insertAdjacentHTML("afterbegin", template);
    if (callback) {
      callback(data);
    }
  }
}

export async function loadTemplate(path) {
  const res = await fetch(path);
  const template = await res.text();
  return template;
}

export async function loadHeaderFooter() {
  const headerTemplate = await loadTemplate("../partials/header.html");
  const footerTemplate = await loadTemplate("../partials/footer.html");
  const headerElement = document.querySelector("#main-header");
  const footerElement = document.querySelector("#main-footer");

  renderWithTemplate(headerTemplate, headerElement);
  renderWithTemplate(footerTemplate, footerElement);
  updateCartBadge();
}

export function alertMessage(message, scroll = true) {
  const alert = document.createElement("div");
  alert.classList.add("alert-banner");
  alert.innerHTML = `<p>${message}</p><span>X</span>`;

  alert.querySelector("span").addEventListener("click", () => {
    alert.remove();
  });

  const main = document.querySelector("main");
  if (main) {
    main.prepend(alert);
  }

  if (scroll) {
    window.scrollTo(0, 0);
  }
}

export function removeAllAlerts() {
  const alerts = document.querySelectorAll(".alert-banner");
  alerts.forEach((alert) => alert.remove());
}

export function updateCartBadge() {
  const cartItems = getLocalStorage("so-cart") || [];
  const totalQuantity = Array.isArray(cartItems)
    ? cartItems.reduce((sum, item) => sum + (item.Quantity || 1), 0)
    : 0;
  const badge = document.querySelector(".cart-badge");

  if (badge) {
    if (totalQuantity > 0) {
      badge.textContent = totalQuantity;
      badge.style.display = "inline-block";
    } else {
      badge.style.display = "none";
    }
  }
}
