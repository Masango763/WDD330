# WDD 330: Web Frontend Development II

Welcome to the repository for **WDD 330 - Web Frontend Development II** (BYU-Idaho / BYU-Pathway Worldwide). This repository contains the source code for the **SleepOutside** e-commerce web application, alongside feature branches for weekly team and individual activities.

---

## 🚀 Week 04 Implementations

- **Error Parsing & Handling:** Refactored `ExternalServices.mjs` to parse JSON bodies before checking HTTP status codes, ensuring backend error payloads pass cleanly to UI `catch` blocks.
- **Client-Side Form Validation:** Integrated native HTML5 constraint validation (`checkValidity()` and `reportValidity()`) in `checkout.js` prior to processing orders.
- **Custom UI Alert Banners:** Created reusable `alertMessage()` and `removeAllAlerts()` utility functions in `utils.mjs` with dismissible banner styling.
- **Order Confirmation Routing:** Updated `CheckoutProcess.mjs` to clear `localStorage` cart state upon order completion and redirect users to `src/cart/success.html`.
- **Vite Multi-Page Build Configuration:** Registered `src/cart/success.html` in `vite.config.js` to support Rollup multi-page bundling during production builds.

---

## 🛠️ Setup & Workflow Commands

Ensure you have [Node.js](https://nodejs.org/) installed before executing project commands.

### Installation
```bash
npm install
Development Commands
npm run start - Starts the local Vite development server with hot-reloading.

npm run build - Builds production-ready assets into the dist/ directory.

npm run lint - Runs ESLint to identify code syntax and formatting issues.

npm run format - Formats JS, HTML, and CSS files using Prettier.

🎮 Final Project Proposal: GameSphere
Project Name: GameSphere – Interactive Discovery & Backlog Tracker

Description: A modern web application combining the RAWG Video Games API and CheapShark Deals API to allow users to search games, view live store discount deals, and manage a personal backlog (Plan to Play, In Progress, Completed) persisted via localStorage.

Planning Board: GameSphere Trello Board

📜 Attribution
SleepOutside starter codebase provided by BYU-Idaho / BYU-Pathway Worldwide.
