# 🪙 MAPALAD - Budget & Transaction Tracker

*   **Developer Name:** Christian Roy Mapalad
*   **Section:** IT0063 - TW291
*   **Live App URL (Render):** [Mapalad - Transaction Tracker](https://taskflow-1-mnlb.onrender.com/)
*   **Live API URL (Render):** [JSON-Server API Service](https://taskflow-1-mnlb.onrender.com/)

MAPALAD is a premium, feature-rich personal finance management dashboard designed to help you organize expenses, track recurring bills, allocate budgets, and plan wants. Built using modern semantic HTML, custom vanilla CSS styling, and raw JavaScript, it offers a visual experience with interactive charts, real-time analytics, and dual-database connectivity.

---

## 🌟 Key Features

### 1. 🔑 Secure Access Portal & Account Sync
*   **Authentication Portal:** User-friendly login and registration flow (`login.html`) with interactive input animations and password visibility toggle.
*   **Offline Guest Mode:** Explore and use the budget tracker fully as a Guest without needing an account; data is saved in `localStorage`.
*   **Auto-Sync Engine:** Once logged in, Guest offline transactions, bills, and wants automatically synchronize to the live backend server.
*   **Data Restoration:** Restores local user data dynamically if the backend JSON-Server has been reset or initialized, ensuring you never lose your records.

### 2. 📊 Interactive Overview Dashboard
*   **Total Balance Tracking:** Real-time calculation of your net savings based on lifetime income and expenses.
*   **Monthly Expenses Bar:** A dynamic progress bar indicating spent percentage relative to your monthly income.
*   **Running Balance Sparkline:** A custom-rendered HTML5 Canvas chart displaying your balance trajectory over the current month.
*   **Category-wise Budget Utilization:** Color-coded gauges tracking your spending per category against configured limits.

### 3. 🧾 Advanced Transaction Ledger (CRUD)
*   **Quick Add & Edit:** Add or update transactions (Date, Description, Category, Type, and Amount) with ease.
*   **Filter & Search:** Live search by description, filter by category, or filter by transaction type (Income/Expense).
*   **Multi-Column Sorting:** Sort transactions by Date, Description, Category, or Amount in either ascending or descending order.

### 4. 🔌 Dual-Database Engine (Server vs. LocalStorage)
*   **JSON-Server (Server Mode):** Saves and reads data in real-time to a local REST database (`db.json`) on port 3000 or 8080.
*   **LocalStorage (Offline Demo Mode):** Automatic fallback system that runs fully offline inside your browser, loading sample seed data and storing modifications directly in the browser's storage.
*   **Live Status Indicator & Switcher:** A sidebar control shows current connection status and allows toggling manually between modes.

### 5. 📅 Recurring Bills Ledger
*   **Flexible Recurrence:** Define one-time, monthly, or yearly bills with custom descriptions and priorities (Low, Medium, High).
*   **Quick Settles:** Cycle statuses (Pending ➔ In-Progress ➔ Settled) directly from the list view.
*   **Automated Bookkeeping:** Settling a bill automatically prompts to log it as an expense, and generates the next recurring billing period instance automatically.
*   **Billing Summary:** Track outstanding total, settled amount, next bill details, and overall payment progress.

### 6. 🛍️ Wants & Allocation Planner
*   **Percentage-based Allocation:** Reserve a precise portion of your current balance for personal wants using a dual slider/number input control.
*   **Cost Control:** Displays allocable wants budget vs. current wanted items' estimated costs.
*   **Wants Ledger:** Manage low, medium, and high-priority wants. Cycling a want to "Bought" triggers a prompt to log it as a transaction.

### 7. 📉 Custom Budgets & Live Analytics
*   **Limit Setter:** Define custom monthly budgets for expense categories (e.g., Food, Utilities, Subscriptions).
*   **Budget Status Grid:** Displays spent vs. limit, remaining funds, and warning indicators for overspending.
*   **Custom Visualizations:** Two HTML5 Canvas charts rendered programmatically for:
    *   *Income vs. Expenses* bar comparison.
    *   *Expenses by Category* donut breakdown with dynamic hover legends.
*   **Category Spending Summary Table:** Outlines total count, spent, average transaction size, and percentage of overall expense per category.

### 8. 👤 Profile & Data Administration
*   **Account Statistics:** View lifetime transaction count, total income, expenses, and net savings.
*   **CSV Export:** Export all transaction history into a standard CSV format with a single click.
*   **Data Resets:** Reset budget limits to default or wipe all transactions clean (with confirmation safeguards).
*   **Endpoint Configurator:** Configure and test connection to custom API server URLs dynamically under the Profile tab.

---

## 🛠️ Tech Stack & Design System

*   **HTML5:** Structured using clean, semantic tags for accessible navigation (`<aside>`, `<main>`, `<section>`, etc.).
*   **CSS3 (Vanilla):** Designed with a sleek dark-border layout, glassmorphic accents, responsive grid columns, customizable CSS variables (`styles.css`, `login.css`), and micro-animations on interactive elements.
*   **JavaScript (ES6+):** Pure vanilla scripting with async REST fetches, custom fetch interceptors for offline fallback handling, and native Canvas drawing APIs.
*   **Typography:** Google Fonts integration of `Inter` for modern dashboard elements and `DotGothic16` for retro-digital accent styling.

---

## 📂 Project Directory Structure

```text
Budget Tracker/
│
├── index.html            # Main dashboard interface layout & views
├── login.html            # Secure access portal & registration UI
├── db.json               # Backend JSON database schema (used by json-server)
├── server.js             # Local backend Express server integrating json-server
├── package.json          # Node dependencies and execution scripts
├── package-lock.json     # Node lockfile
│
├── css/
│   ├── styles.css        # Premium UI styles, theme variables, and dashboards layout
│   └── login.css         # Styling and custom animations for the login/register screen
│
├── js/
│   ├── app.js            # Main dashboard logic, CRUD actions, sync scripts, & canvas drawing
│   └── login.js          # Authentication logic, network check retries, & offline database state
│
└── README.md             # Project documentation (this file)
```

---

## 🚀 Getting Started & Run Instructions

MAPALAD is ready to run immediately. You can run both the frontend and backend locally in one command using Node.js:

### 1. Installation & Local Setup

Make sure you have [Node.js](https://nodejs.org/) installed.

1. Open a terminal in the project root directory.
2. Install the required dependencies:
   ```bash
   npm install
   ```
3. Start the unified local server:
   ```bash
   npm start
   ```
   *This starts the Express/JSON-Server backend on port `8080` (or process.env.PORT) and serves the static frontend assets from the same server.*

4. Open [http://localhost:8080](http://localhost:8080) in your web browser.

### 2. Database Mode Connectivity (Live Server vs. LocalStorage)

The application dynamically toggles between a server API database and LocalStorage fallback:

*   **Live Server Mode:** By default, the application connects to your local server on port `8080` (or falls back to the Render live API at `https://taskflow-1-mnlb.onrender.com`). You can also configure a custom API Server endpoint directly in the **Profile** tab.
*   **LocalStorage Offline Mode:** If the connection to the server is unavailable or manually toggled off via the Database Status control in the sidebar, the app falls back to LocalStorage mode, using seed data stored in your browser.

---

## 💡 Usage Highlights & Tips

*   **Dual Status Indicators:** Displays real-time database connection status (Green for Server Mode, Indigo/Blue for LocalStorage Mode) and user profile state (Guest Mode vs. Authenticated User) directly in the sidebar dashboard.
*   **Smart State Transitions:** Logging in automatically syncs your local Guest data to the server backend. Logging out wipes your active session state but retains local browser data.
*   **API Configuration:** If you deploy your backend to Render, Vercel, or another platform, simply input the base URL in the **Profile** tab, click **Set URL**, and the app will re-detect and bind to the new endpoint.
*   **Clear Filters:** Reset filter and sort settings on the Transactions tab instantly by clicking **Clear Filters**.
