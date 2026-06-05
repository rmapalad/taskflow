# 🪙 MAPALAD - Budget & Transaction Tracker

*   **Developer Name:** Christian Roy Mapalad
*   **Live App URL (Vercel):** [Live Deployment Details](https://vercel.com/rmapalad-5825s-projects/taskflow-97nq/5vZ4pnmBbd1dEdS7Qjp5ZnRAW8nv)
*   **Live API URL (Render):** [JSON-Server API Service](https://taskflow-1-mnlb.onrender.com/)

MAPALAD is a premium, feature-rich personal finance management dashboard designed to help you organize expenses, track recurring bills, allocate budgets, and plan wants. Built using modern semantic HTML, custom vanilla CSS styling, and raw JavaScript, it offers a visual experience with interactive charts, real-time analytics, and dual-database connectivity.

---

## 🌟 Key Features

### 1. 📊 Interactive Overview Dashboard
*   **Total Balance Tracking:** Real-time calculation of your net savings based on lifetime income and expenses.
*   **Monthly Expenses Bar:** A dynamic progress bar indicating spent percentage relative to your monthly income.
*   **Running Balance Sparkline:** An custom-rendered HTML5 Canvas chart displaying your balance trajectory over the current month.
*   **Category-wise Budget Utilization:** Color-coded gauges tracking your spending per category against configured limits.

### 2. 🧾 Advanced Transaction Ledger (CRUD)
*   **Quick Add & Edit:** Add or update transactions (Date, Description, Category, Type, and Amount) with ease.
*   **Filter & Search:** Live search by description, filter by category, or filter by transaction type (Income/Expense).
*   **Multi-Column Sorting:** Sort transactions by Date, Description, Category, or Amount in either ascending or descending order.

### 3. 🔌 Dual-Database Engine (Server vs. LocalStorage)
*   **JSON-Server (Server Mode):** Saves and reads data in real-time to a local REST database (`db.json`) on port 3000.
*   **LocalStorage (Offline Demo Mode):** Automatic fallback system that runs fully offline inside your browser, loading sample seed data and storing modifications directly in the browser's storage.
*   **Live Status Indicator & Switcher:** A sidebar control shows current connection status and allows toggling manually between modes.

### 4. 📅 Recurring Bills Ledger
*   **Flexible Recurrence:** Define one-time, monthly, or yearly bills with custom descriptions and priorities (Low, Medium, High).
*   **Quick Settles:** Cycle statuses (Pending ➔ In-Progress ➔ Settled) directly from the list view.
*   **Automated Bookkeeping:** Settling a bill automatically prompts to log it as an expense, and generates the next recurring billing period instance automatically.
*   **Billing Summary:** Track outstanding total, settled amount, next bill details, and overall payment progress.

### 5. 🛍️ Wants & Allocation Planner
*   **Percentage-based Allocation:** Reserve a precise portion of your current balance for personal wants using a dual slider/number input control.
*   **Cost Control:** Displays allocable wants budget vs. current wanted items' estimated costs.
*   **Wants Ledger:** Manage low, medium, and high-priority wants. Cycling a want to "Bought" triggers a prompt to log it as a transaction.

### 6. 📉 Custom Budgets & Live Analytics
*   **Limit Setter:** Define custom monthly budgets for expense categories (e.g., Food, Utilities, Subscriptions).
*   **Budget Status Grid:** Displays spent vs. limit, remaining funds, and warning indicators for overspending.
*   **Custom Visualizations:** Two HTML5 Canvas charts rendered programmatically for:
    *   *Income vs. Expenses* bar comparison.
    *   *Expenses by Category* donut breakdown with dynamic hover legends.
*   **Category Spending Summary Table:** Outlines total count, spent, average transaction size, and percentage of overall expense per category.

### 7. 👤 Profile & Data Administration
*   **Account Statistics:** View lifetime transaction count, total income, expenses, and net savings.
*   **CSV Export:** Export all transaction history into a standard CSV format with a single click.
*   **Data Resets:** Reset budget limits to default or wipe all transactions clean (with confirmation safeguards).

---

## 🛠️ Tech Stack & Design System

*   **HTML5:** Structured using clean, semantic tags for accessible navigation (`<aside>`, `<main>`, `<section>`, etc.).
*   **CSS3 (Vanilla):** Designed with a sleek dark-border layout, glassmorphic accents, responsive grid columns, customizable CSS variables (`styles.css`), and micro-animations on interactive elements.
*   **JavaScript (ES6+):** Pure vanilla scripting with async REST fetches, custom fetch interceptors for offline fallback handling, and native Canvas drawing APIs.
*   **Typography:** Google Fonts integration of `Inter` for modern dashboard elements and `DotGothic16` for retro-digital accent styling.

---

## 📂 Project Directory Structure

```text
Budget Tracker/
│
├── index.html            # Main HTML layout, dashboard markup, and views
├── db.json               # Backend JSON database (used by json-server)
│
├── css/
│   └── styles.css        # Premium UI styles, theme variables, and layouts
│
├── js/
│   └── app.js            # Main application logic, CRUD handlers, and canvas rendering
│
└── README.md             # Project documentation (this file)
```

---

## 🚀 Getting Started & Run Instructions

MAPALAD is ready to run immediately. You can run the application locally using a static web server or connect it to your live API.

### 1. Running the Frontend Locally (via Local Static Server)
Do not open `index.html` by double-clicking it. Instead, serve the application using a static web server:

1. Make sure you have [Node.js](https://nodejs.org/) installed.
2. Open a terminal in the project root directory and run:
   ```bash
   npx serve
   ```
3. Open the provided URL (e.g. `http://localhost:3000` or `http://localhost:5000`) in your web browser.

### 2. Database Mode Connectivity (Live Server vs. LocalStorage)
The application dynamically switches between a live backend database and local storage demo:

*   **Live Server Mode:** By default, the application connects to the live API on Render (`https://taskflow-1-mnlb.onrender.com`). You can also toggle/set custom server URLs via the **API Server Configuration** input located in the **Profile** tab.
*   **LocalStorage Offline Mode:** If the connection to the API is unavailable or manually toggled off via the Database Status control in the sidebar, the app falls back to LocalStorage mode, using seed data stored in your browser.

---

## 💡 Usage Highlights & Defense Tips

*   **Custom Status Indicators:** Features a dynamic live status indicator dot in the sidebar for Database Mode (Green for Server Mode, Indigo/Blue for LocalStorage Mode).
*   **Authentication & Sync:** Log in with an account to sync offline Guest transactions, bills, and wants automatically to the live backend server database.
*   **Filter Clears:** Click the **Clear Filters** button on the Transactions tab to quickly revert to the default month's transaction listing.
