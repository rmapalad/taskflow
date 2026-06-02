# 🪙 MAPALAD - Budget & Transaction Tracker

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

## 🚀 Getting Started

MAPALAD is ready to run immediately. You can choose to run it offline or set up the API database server.

### Option A: LocalServer Mode (Recommended)
This mode connects the app to the `db.json` database.

1.  Make sure you have [Node.js](https://nodejs.org/) installed.
2.  Install `json-server` globally, or run it directly using `npx`:
    ```bash
    npx json-server --watch db.json --port 3000
    ```
3.  Open `index.html` directly in your browser or run it using a local static server extension (e.g., Live Server in VS Code).
4.  The sidebar database mode indicator will light up green (**Server Mode**).

### Option B: Offline / LocalStorage Mode (Zero Setup)
If the local server is not detected, the app automatically switches to **LocalStorage Mode**.

1.  Open `index.html` directly in any web browser.
2.  The application will automatically initialize browser local storage with seed data.
3.  The database mode indicator will show purple (**LocalStorage Mode**). All operations will save locally inside your browser cache.

---

## 💡 Usage Highlights

*   **Status Indicators:** Look out for color-coded priority tags (`low`, `medium`, `high`) and transaction amounts (green for positive income, red for negative expenses).
*   **Filter Clears:** Click the **Clear Filters** button in the Filter & Sort box to immediately revert back to your default monthly view.
*   **Database Syncing:** If you start the local `json-server` later, simply click the **Connect to Server** button in the sidebar to sync your sessions.
