export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function alertMessage(message, scroll = true) {
  const alert = document.createElement("div");
  alert.classList.add("alert");
  alert.innerHTML = `<p>${message}</p><span>X</span>`;

  alert.addEventListener("click", function (e) {
    if (e.target.tagName === "SPAN") {
      const main = document.querySelector("main");
      if (main && main.contains(this)) {
        main.removeChild(this);
      }
    }
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
  const alerts = document.querySelectorAll(".alert");
  alerts.forEach((alert) => alert.remove());
}

export async function loadTemplate(path) {
  const res = await fetch(path);
  const template = await res.text();
  return template;
}

export async function loadHeaderFooter() {
  const headerTemplate = await loadTemplate("/partials/header.html");
  const footerTemplate = await loadTemplate("/partials/footer.html");

  const headerElem = document.querySelector("#main-header");
  const footerElem = document.querySelector("#main-footer");

  if (headerElem) headerElem.innerHTML = headerTemplate;
  if (footerElem) footerElem.innerHTML = footerTemplate;
}

export function alertMessage(message, scroll = true) {
  const alert = document.createElement('div');
  alert.classList.add('alert-banner');
  alert.innerHTML = `<span>${message}</span><span class="alert-close">X</span>`;

  alert.querySelector('.alert-close').addEventListener('click', () => {
    alert.remove();
  });

  const main = document.querySelector('main');
  main.prepend(alert);

  if (scroll) {
    window.scrollTo(0, 0);
  }
}

export function removeAllAlerts() {
  const alerts = document.querySelectorAll('.alert-banner');
  alerts.forEach((alert) => alert.remove());
}
