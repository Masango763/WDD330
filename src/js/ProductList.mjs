import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  const imgSrc = product.Images?.PrimaryMedium || product.Image || "";
  const brandName = product.Brand?.Name || "";
  const name = product.NameWithoutBrand || product.Name || "";

  return `<li class="product-card">
    <a href="/product_pages/index.html?product=${product.Id}">
      <img src="${imgSrc}" alt="${name}" />
      <h3 class="card__brand">${brandName}</h3>
      <h2 class="card__name">${name}</h2>
      <p class="product-card__price">$${product.FinalPrice}</p>
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
    if (!this.category) return;
    const list = await this.dataSource.getData(this.category);
    this.renderList(list);

    const titleElement = document.querySelector(".title");
    if (titleElement) {
      titleElement.innerHTML = this.category.toUpperCase();
    }
  }

  renderList(list) {
    if (!this.listElement || !Array.isArray(list)) return;
    renderListWithTemplate(productCardTemplate, this.listElement, list, "afterbegin", true);
  }
}
