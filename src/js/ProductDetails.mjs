import { setLocalStorage, getLocalStorage } from './utils.mjs';

function productTemplate(product) {
  return `<section class="product-detail">
    <h3>${product.Brand.Name}</h3>
    <h2 class="divider">${product.NameWithoutBrand}</h2>
    <img
      class="divider"
      src="${product.Image}"
      alt="${product.NameWithoutBrand}"
    />
    <p class="product-card__price">$${product.FinalPrice}</p>
    <p class="product__color">${product.Colors[0].ColorName}</p>
    <p class="product__description__html">${product.DescriptionHtmlSimple}</p>
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
    // 1. Fetch details for the current product using the provided data source
    this.product = await this.dataSource.findProductById(this.productId);

    // 2. Render HTML details onto the page
    this.renderProductDetails('main');

    // 3. Attach click event listener to the "Add to Cart" button
    document
      .getElementById('addToCart')
      .addEventListener('click', this.addToCart.bind(this));
  }

  addToCart() {
    const currentCart = getLocalStorage('so-cart') || [];
    currentCart.push(this.product);
    setLocalStorage('so-cart', currentCart);
  }

  renderProductDetails(selector) {
    const element = document.querySelector(selector);
    element.insertAdjacentHTML('afterbegin', productTemplate(this.product));
  }
}
