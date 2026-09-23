import { getLocalStorage, setLocalStorage, alertMessage, removeAllAlerts } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

const services = new ExternalServices();

function formDataToJSON(formElement) {
  const formData = new FormData(formElement);
  const convertedJSON = {};
  formData.forEach((value, key) => {
    convertedJSON[key] = value;
  });
  return convertedJSON;
}

function packageItems(items) {
  return items.map((item) => ({
    id: item.Id,
    name: item.Name,
    price: item.FinalPrice,
    quantity: item.Quantity || 1
  }));
}

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.itemCount = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {
    this.list = getLocalStorage(this.key) || [];
    this.calculateItemSubTotal();
  }

  calculateItemSubTotal() {
    this.itemTotal = this.list.reduce(
      (sum, item) => sum + item.FinalPrice * (item.Quantity || 1),
      0
    );
    this.itemCount = this.list.reduce(
      (sum, item) => sum + (item.Quantity || 1),
      0
    );

    const subtotalElem = document.querySelector(`${this.outputSelector} #subtotal`);
    if (subtotalElem) {
      subtotalElem.innerText = `$${this.itemTotal.toFixed(2)}`;
    }
  }

  calculateOrderTotal() {
    if (this.itemCount > 0) {
      this.shipping = 10 + (this.itemCount - 1) * 2;
    } else {
      this.shipping = 0;
    }
    this.tax = this.itemTotal * 0.06;
    this.orderTotal = this.itemTotal + this.shipping + this.tax;

    this.displayOrderTotals();
  }

  displayOrderTotals() {
    const shippingElem = document.querySelector(`${this.outputSelector} #shipping`);
    const taxElem = document.querySelector(`${this.outputSelector} #tax`);
    const totalElem = document.querySelector(`${this.outputSelector} #orderTotal`);

    if (shippingElem) shippingElem.innerText = `$${this.shipping.toFixed(2)}`;
    if (taxElem) taxElem.innerText = `$${this.tax.toFixed(2)}`;
    if (totalElem) totalElem.innerText = `$${this.orderTotal.toFixed(2)}`;
  }

  async checkout(form) {
    const jsonPayload = formDataToJSON(form);
    jsonPayload.orderDate = new Date().toISOString();
    jsonPayload.orderTotal = this.orderTotal.toFixed(2);
    jsonPayload.tax = this.tax.toFixed(2);
    jsonPayload.shipping = this.shipping;
    jsonPayload.items = packageItems(this.list);

    try {
      const res = await services.checkout(jsonPayload);
      setLocalStorage(this.key, []);
      location.assign("/cart/success.html");
      return res;
    } catch (err) {
      removeAllAlerts();
      if (err.name === "servicesError" && typeof err.message === "object") {
        for (const key in err.message) {
          alertMessage(err.message[key]);
        }
      } else {
        alertMessage(err.message || "An error occurred during checkout.");
      }
    }
  }
}
