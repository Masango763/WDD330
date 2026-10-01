import { loadHeaderFooter } from './utils.mjs';

loadHeaderFooter();

import { updateCartBadge } from "./utils.mjs";

document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
});
