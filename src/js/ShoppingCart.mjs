import { getLocalStorage, renderListWithTemplate } from "./utils.mjs";

function cartItemTemplate(item) {
  return `<li class="cart-card divider">
    <a href="/product_pages/index.html?product=${item.Id}" class="cart-card__image">
      <img src="${item.Images?.PrimaryMedium || item.Image}" alt="${item.Name}" />
    </a>
    <a href="/product_pages/index.html?product=${item.Id}">
      <h2 class="card__name">${item.Name}</h2>
    </a>
    <p class="cart-card__color">${item.Colors ? item.Colors[0].ColorName : ""}</p>
    <p class="cart-card__quantity">qty: 1</p>
    <p class="cart-card__price">$${item.FinalPrice}</p>
  </li>`;
}

export default class ShoppingCart {
  constructor(key, parentSelector) {
    this.key = key;
    this.parentSelector = parentSelector;
  }

  async init() {
    const list = getLocalStorage(this.key);
    const validList = Array.isArray(list) ? list : [];
    this.renderCartContents(validList);
  }

  calculateListTotal(list) {
    return list.reduce((total, item) => total + (item.FinalPrice || 0), 0);
  }

  renderCartContents(cartItems) {
    const element = document.querySelector(this.parentSelector);
    const footerElement = document.querySelector(".cart-footer");
    const totalElement = document.querySelector(".cart-total");

    if (!element) return;

    if (!cartItems || cartItems.length === 0) {
      element.innerHTML = "<p class='empty-cart-message'>Your cart is currently empty.</p>";
      if (footerElement) {
        footerElement.classList.add("hide");
      }
    } else {
      renderListWithTemplate(cartItemTemplate, element, cartItems, "afterbegin", true);
      
      const total = this.calculateListTotal(cartItems);
      if (totalElement) {
        totalElement.innerText = `Total: $${total.toFixed(2)}`;
      }
      if (footerElement) {
        footerElement.classList.remove("hide");
      }
    }
  }
}
