import { getLocalStorage, setLocalStorage, alertMessage, removeAllAlerts } from './utils.mjs';
import ExternalServices from './ExternalServices.mjs';

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
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {
    this.list = getLocalStorage(this.key) || [];
    this.calculateItemSubTotal();
  }

  calculateItemSubTotal() {
    const totalQuantity = this.list.reduce((sum, item) => sum + (item.Quantity || 1), 0);
    this.itemTotal = this.list.reduce((sum, item) => sum + (item.FinalPrice * (item.Quantity || 1)), 0);

    const countElement = document.querySelector(`${this.outputSelector} #num-items`);
    const subtotalElement = document.querySelector(`${this.outputSelector} #subtotal`);

    if (countElement) countElement.innerText = totalQuantity;
    if (subtotalElement) subtotalElement.innerText = `$${this.itemTotal.toFixed(2)}`;
  }

  calculateOrderTotal() {
    const totalCount = this.list.reduce((sum, item) => sum + (item.Quantity || 1), 0);

    this.tax = this.itemTotal * 0.06;
    this.shipping = totalCount > 0 ? 10 + (totalCount - 1) * 2 : 0;
    this.orderTotal = this.itemTotal + this.tax + this.shipping;

    this.displayOrderTotals();
  }

  displayOrderTotals() {
    const taxEl = document.querySelector(`${this.outputSelector} #tax`);
    const shippingEl = document.querySelector(`${this.outputSelector} #shipping`);
    const orderTotalEl = document.querySelector(`${this.outputSelector} #orderTotal`);

    if (taxEl) taxEl.innerText = `$${this.tax.toFixed(2)}`;
    if (shippingEl) shippingEl.innerText = `$${this.shipping.toFixed(2)}`;
    if (orderTotalEl) orderTotalEl.innerText = `$${this.orderTotal.toFixed(2)}`;
  }

  async checkout(form) {
    const jsonPayload = formDataToJSON(form);

    jsonPayload.orderDate = new Date().toISOString();
    jsonPayload.orderTotal = this.orderTotal.toFixed(2);
    jsonPayload.tax = this.tax.toFixed(2);
    jsonPayload.shipping = this.shipping;
    jsonPayload.items = packageItems(this.list);

    try {
      await services.checkout(jsonPayload);
      setLocalStorage(this.key, []);
      window.location.href = './success.html';
    } catch (err) {
      removeAllAlerts();
      if (err.message && typeof err.message === 'object') {
        for (const key in err.message) {
          alertMessage(`${key}: ${err.message[key]}`);
        }
      } else {
        alertMessage('Order failed. Please check your card details and try again.');
      }
    }
  }
}
