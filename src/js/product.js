import ExternalServices from "./ExternalServices.mjs";
import ProductDetails from "./ProductDetails.mjs";
import { loadHeaderFooter, getParam } from "./utils.mjs";

loadHeaderFooter();

const productId = getParam("product");
const dataSource = new ExternalServices();

if (productId) {
  const product = new ProductDetails(productId, dataSource);
  product.init();
}
