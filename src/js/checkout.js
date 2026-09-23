import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

loadHeaderFooter();

const myCheckout = new CheckoutProcess("so-cart", ".order-summary");
myCheckout.init();

const zipInput = document.querySelector("#zip");
if (zipInput) {
  zipInput.addEventListener("blur", () => {
    myCheckout.calculateOrderTotal();
  });
}

const form = document.querySelector("#checkout-form");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const status = form.checkValidity();
    form.reportValidity();
    if (status) {
      myCheckout.calculateOrderTotal();
      myCheckout.checkout(form);
    }
  });
}
