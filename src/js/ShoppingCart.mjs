import { getLocalStorage, setLocalStorage, renderListWithTemplate, updateCartBadge } from "./utils.mjs";

function cartItemTemplate(item) {
  const imgSrc = item.Images?.PrimaryMedium || item.Image || "";
  const name = item.NameWithoutBrand || item.Name || "";
  const qty = item.Quantity || 1;
  const price = item.FinalPrice || item.ListPrice || 0;
  const itemTotal = (price * qty).toFixed(2);
  const color = item.Colors && item.Colors[0] ? item.Colors[0].ColorName : "";

  return `<li class="cart-card divider">
    <a href="/product_pages/index.html?product=${item.Id}" class="cart-card__image">
      <img src="${imgSrc}" alt="${name}" />
    </a>
    <a href="/product_pages/index.html?product=${item.Id}">
      <h2 class="card__name">${name}</h2>
    </a>
    <p class="cart-card__color">${color}</p>
    <div class="cart-card__quantity">
      <button class="cart-qty-btn qty-minus" data-id="${item.Id}">-</button>
      <span class="cart-quantity">${qty}</span>
      <button class="cart-qty-btn qty-plus" data-id="${item.Id}">+</button>
    </div>
    <p class="cart-card__price">$${itemTotal}</p>
    <span class="cart-card__remove" data-id="${item.Id}" title="Remove Item">✕</span>
  </li>`;
}

export default class ShoppingCart {
  constructor(key, parentSelector) {
    this.key = key;
    this.parentSelector = parentSelector;
  }

  init() {
    const list = getLocalStorage(this.key) || [];
    this.renderCartContents(list);
    this.calculateListTotal(list);
  }

  renderCartContents(cartList) {
    const parentElement = document.querySelector(this.parentSelector);
    if (!parentElement) return;

    if (!cartList || cartList.length === 0) {
      parentElement.innerHTML = "<p class='empty-cart-msg'>Your cart is currently empty.</p>";
      this.calculateListTotal([]);
      return;
    }

    renderListWithTemplate(cartItemTemplate, parentElement, cartList, "afterbegin", true);
    this.addEventListeners();
  }

  calculateListTotal(list) {
    const totalElement = document.querySelector(".cart-total");
    const totalContainer = document.querySelector(".cart-footer");

    if (!list || list.length === 0) {
      if (totalContainer) totalContainer.classList.add("hide");
      if (totalElement) totalElement.innerText = "Total: $0.00";
      return;
    }

    if (totalContainer) totalContainer.classList.remove("hide");

    const total = list.reduce(
      (sum, item) => sum + (item.FinalPrice || item.ListPrice || 0) * (item.Quantity || 1),
      0
    );

    if (totalElement) {
      totalElement.innerText = `Total: $${total.toFixed(2)}`;
    }
  }

  addEventListeners() {
    const parent = document.querySelector(this.parentSelector);
    if (!parent) return;

    parent.onclick = (e) => {
      const id = e.target.dataset.id;
      if (!id) return;

      let cart = getLocalStorage(this.key) || [];

      if (e.target.classList.contains("cart-card__remove")) {
        cart = cart.filter((item) => item.Id !== id);
      } else if (e.target.classList.contains("qty-plus")) {
        const item = cart.find((i) => i.Id === id);
        if (item) item.Quantity = (item.Quantity || 1) + 1;
      } else if (e.target.classList.contains("qty-minus")) {
        const item = cart.find((i) => i.Id === id);
        if (item) {
          item.Quantity = (item.Quantity || 1) - 1;
          if (item.Quantity <= 0) {
            cart = cart.filter((i) => i.Id !== id);
          }
        }
      }

      setLocalStorage(this.key, cart);
      updateCartBadge();
      this.renderCartContents(cart);
      this.calculateListTotal(cart);
    };
  }
}
