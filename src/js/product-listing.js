import { loadHeaderFooter, getParam } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import ProductList from "./ProductList.mjs";

loadHeaderFooter();

const category = getParam("category") || "tents";
const categoryTitle = document.querySelector(".title");
if (categoryTitle) {
  categoryTitle.innerHTML = `Top Products: <span class="highlight">${category.replace("-", " ").toUpperCase()}</span>`;
}

const dataSource = new ExternalServices();
const listElement = document.querySelector(".product-list");
const myList = new ProductList(category, dataSource, listElement);

myList.init();
