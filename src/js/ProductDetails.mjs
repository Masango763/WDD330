import { getLocalStorage, setLocalStorage, updateCartBadge, alertMessage } from "./utils.mjs";

function productDetailsTemplate(product) {
  const brandName = product.Brand ? product.Brand.Name : "";
  const name = product.NameWithoutBrand || product.Name || "";
  const imgSrc = product.Images ? product.Images.PrimaryLarge : product.Image || "";
  const price = product.FinalPrice || product.ListPrice || "0.00";
  const color = product.Colors && product.Colors[0] ? product.Colors[0].ColorName : "";
  const desc = product.DescriptionHtmlSimple || product.Description || "";

  return `<section class="product-detail">
    <h3>${brandName}</h3>
    <h2 class="divider">${name}</h2>
    <img
      class="divider"
      src="${imgSrc}"
      alt="${name}"
    />
    <p class="product-card__price">$${price}</p>
    <p class="product__color">${color}</p>
    <p class="product__description">
      ${desc}
    </p>
    <div class="product-detail__add">
      <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
    </div>
  </section>`;
}

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);
    this.renderProductDetails("main");
    const addButton = document.getElementById("addToCart");
    if (addButton) {
      addButton.addEventListener("click", this.addProductToCart.bind(this));
    }
  }

  addProductToCart() {
    let cart = getLocalStorage("so-cart") || [];
    if (!Array.isArray(cart)) cart = [];

    const existingIndex = cart.findIndex((item) => item.Id === this.product.Id);

    if (existingIndex > -1) {
      cart[existingIndex].Quantity = (cart[existingIndex].Quantity || 1) + 1;
    } else {
      this.product.Quantity = 1;
      cart.push(this.product);
    }

    setLocalStorage("so-cart", cart);
    updateCartBadge();
    alertMessage(`${this.product.NameWithoutBrand || this.product.Name || "Item"} added to cart!`);
  }

  renderProductDetails(selector) {
    const element = document.querySelector(selector);
    if (element) {
      element.innerHTML = productDetailsTemplate(this.product);
    }
  }
}
