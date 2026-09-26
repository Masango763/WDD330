import CheckoutProcess from './CheckoutProcess.mjs';

const myCheckout = new CheckoutProcess('so-cart', '#order-summary');
myCheckout.init();

document.querySelector('#zip').addEventListener('blur', () => {
  myCheckout.calculateOrderTotal();
});

document.querySelector('#checkoutSubmit').addEventListener('click', (e) => {
  e.preventDefault();
  const form = document.forms['checkout-form'];
  const isValid = form.checkValidity();
  form.reportValidity();

  if (isValid) {
    myCheckout.checkout(form);
  }
});
