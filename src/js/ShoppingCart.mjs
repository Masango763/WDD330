import { getLocalStorage, renderListWithTemplate } from './utils.mjs';

export default class ShoppingCart {
  constructor(key, parentSelector) {
    this.key = key;
    this.parentSelector = parentSelector;
    this.total = 0;
  }

  async init() {
    const cartItems = getLocalStorage(this.key);
    if (cartItems) {
      this.renderCart(cartItems);
      this.calculateCartTotal(cartItems);
    }
  }

  renderCart(items) {
    const element = document.querySelector(this.parentSelector);
    renderListWithTemplate(cartItemTemplate, element, items, "afterbegin", true);
  }

  calculateCartTotal(items) {
    const amounts = items.map((item) => item.FinalPrice);
    this.total = amounts.reduce((sum, item) => sum + item, 0);
    const summaryElement = document.querySelector(".cart-footer");
    if (summaryElement) {
      summaryElement.innerHTML = `Total: $${this.total.toFixed(2)}`;
      summaryElement.classList.remove("hide");
    }
  }
}

function cartItemTemplate(item) {
  return `<li class="cart-card divider">
    <a href="#" class="cart-card__image">
      <img src="${item.Images.PrimaryMedium}" alt="${item.Name}" />
    </a>
    <a href="#">
      <h2 class="card__name">${item.Name}</h2>
    </a>
    <p class="cart-card__color">${item.Colors[0].ColorName}</p>
    <p class="cart-card__quantity">qty: 1</p>
    <p class="cart-card__price">$${item.FinalPrice}</p>
  </li>`;
}
