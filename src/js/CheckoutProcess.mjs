import { getLocalStorage, setLocalStorage, alertMessage, removeAllAlerts } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

const services = new ExternalServices();

function packageItems(items) {
  return items.map((item) => ({
    id: item.Id,
    price: item.FinalPrice || item.ListPrice,
    name: item.NameWithoutBrand || item.Name,
    quantity: item.Quantity || 1
  }));
}

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {
    this.list = getLocalStorage(this.key) || [];
    this.calculateItemSummary();
  }

  calculateItemSummary() {
    const summaryElement = document.querySelector(this.outputSelector + " #cartTotal");
    const numItemsElement = document.querySelector(this.outputSelector + " #num-items");

    const itemCount = this.list.reduce((sum, item) => sum + (item.Quantity || 1), 0);
    this.itemTotal = this.list.reduce(
      (sum, item) => sum + (item.FinalPrice || item.ListPrice || 0) * (item.Quantity || 1),
      0
    );

    if (numItemsElement) numItemsElement.innerText = itemCount;
    if (summaryElement) summaryElement.innerText = `$${this.itemTotal.toFixed(2)}`;

    this.calculateOrdertotals();
  }

  calculateOrdertotals() {
    const itemCount = this.list.reduce((sum, item) => sum + (item.Quantity || 1), 0);

    if (itemCount > 0) {
      this.shipping = 10 + (itemCount - 1) * 2;
      this.tax = this.itemTotal * 0.06;
      this.orderTotal = this.itemTotal + this.shipping + this.tax;
    } else {
      this.shipping = 0;
      this.tax = 0;
      this.orderTotal = 0;
    }

    this.displayOrderTotals();
  }

  displayOrderTotals() {
    const shipping = document.querySelector(this.outputSelector + " #shipping");
    const tax = document.querySelector(this.outputSelector + " #tax");
    const orderTotal = document.querySelector(this.outputSelector + " #orderTotal");

    if (shipping) shipping.innerText = `$${this.shipping.toFixed(2)}`;
    if (tax) tax.innerText = `$${this.tax.toFixed(2)}`;
    if (orderTotal) orderTotal.innerText = `$${this.orderTotal.toFixed(2)}`;
  }

  async checkout(form) {
    const json = formDataToJSON(form);
    json.orderDate = new Date();
    json.orderTotal = this.orderTotal.toFixed(2);
    json.tax = this.tax.toFixed(2);
    json.shipping = this.shipping.toFixed(2);
    json.items = packageItems(this.list);

    try {
      const res = await services.checkout(json);
      setLocalStorage("so-cart", []);
      location.assign("/cart/success.html");
    } catch (err) {
      removeAllAlerts();
      for (let message in err.message) {
        alertMessage(err.message[message]);
      }
    }
  }
}

function formDataToJSON(formElement) {
  const formData = new FormData(formElement);
  const convertedJSON = {};
  formData.forEach((value, key) => {
    convertedJSON[key] = value;
  });
  return convertedJSON;
}
