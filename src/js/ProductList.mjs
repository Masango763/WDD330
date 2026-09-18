import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  const hasDiscount = product.SuggestedRetailPrice && product.SuggestedRetailPrice > product.FinalPrice;
  const discountPercent = hasDiscount
    ? Math.round(((product.SuggestedRetailPrice - product.FinalPrice) / product.SuggestedRetailPrice) * 100)
    : 0;

  return `<li class="product-card">
    <a href="/product_pages/index.html?product=${product.Id}">
      <img src="${product.Images?.PrimaryMedium || product.Image}" alt="${product.Name}">
      <h3 class="card__brand">${product.Brand?.Name || ''}</h3>
      <h2 class="card__name">${product.Name}</h2>
      <div class="product-card__price-container">
        <p class="product-card__price">$${product.FinalPrice}</p>
        ${hasDiscount ? `
          <span class="original-price">$${product.SuggestedRetailPrice.toFixed(2)}</span>
          <span class="discount-badge">-${discountPercent}% OFF</span>
        ` : ''}
      </div>
    </a>
  </li>`;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    const list = await this.dataSource.getData(this.category);
    this.renderList(list);
  }

  renderList(list) {
    renderListWithTemplate(productCardTemplate, this.listElement, list, "afterbegin", true);
  }
}
