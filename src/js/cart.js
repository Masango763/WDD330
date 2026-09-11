import { getLocalStorage } from "./utils.mjs";

function cartItemTemplate(item) {
  return `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img src="${item.Image}" alt="${item.Name}" />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;
}

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");
  const element = document.querySelector(".product-list");

  if (!cartItems || cartItems.length === 0) {
    element.innerHTML =
      '<li class="cart-empty"><p>Your cart is currently empty.</p></li>';
    return;
  }

  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  element.innerHTML = htmlItems.join("");
}

renderCartContents();
