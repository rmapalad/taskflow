# 🍀 FourLeaf Finance
**Retro-Inspired Brutalist Transaction & Budget Tracker**

FourLeaf Finance (developed under the code name *Mapalad*) is a high-performance, retro-styled web application built with **React 19** and **Vite**, featuring real-time data synchronization with **Google Cloud Firestore**, local offline persistence, and personal financial guidance powered by **Gemini 3.5 Flash**.

---

## 🎨 Design Philosophy: Retro Brutalism
The interface departs from generic modern SaaS visual styles in favor of a bold, premium **brutalist aesthetic**:
* **High Contrast**: Sleek light/dark panels, pure black borders, and heavy 4px box-shadow offsets.
* **Typography**: Monospace terminal headers powered by `DotGothic16` and highly readable body layout sizing using `Inter`.
* **Micro-Animations**: Blinking input carets, password toggling icons, active sidebar markers, and responsive alert systems.

---

## 🚀 Key System Features

1. **📊 Financial nerve center (Dashboard)**
   * Chronological line graphing showing running balance history dynamically drawn on a custom HTML5 `<canvas>`.
   * Real-time cash flow widgets displaying net balance, total income, and monthly expenses.
   
2. **💸 Transactions Ledger**
   * Multi-column table logging Category, Type (Income vs Expense), Date, Description, and Amount (₱ / PHP).
   * Search by keyword, sort by column headings (Date or Amount), and filter by category or income/expense classification.
   * Full client-side pagination (10 items per page).

3. **🎯 Budget Limits & Ceilings**
   * Spend limits per expense category.
   * Real-time progress bars indicating spent percentages, dynamically changing to warning red on overspend.

4. **📅 Recurring Bills Tracker**
   * Priority-coded logs of monthly bills and payment due dates.
   * One-click "Mark Paid" operation that auto-creates an expense transaction in your ledger and rolls over recurring bill instances.

5. **🎁 Wants Allocation (50/30/20 Rule)**
   * Allocation slider to assign a custom percentage of monthly net income to discretionary spending.
   * Wishlist with a "Purchase" button to deduct items from your available wants budget pool and log the expense.

6. **🤖 Flagship Feature: Gemini AI Advisor**
   * Powered by **Gemini 3.5 Flash** using the Firebase AI SDK.
   * **Macro Insights**: Analyzes cash flows, detects lifestyle creep, and computes emergency fund gaps.
   * **Want Trade-Offs**: Evaluates the gap to fund a wishlist item and recommends lifestyle trade-offs (e.g., cooking at home to save ₱1,500).
   * **Hallucination Prevention**: JavaScript pre-processes all statistics client-side, sending constants to the model to guarantee mathematical alignment.
   * **PH Localization**: Recommends local digital banks (Maya, GoTyme, Tonik) and government stashes (Pag-IBIG MP2).

7. **☁️ Dual-Layer DB Sync & Offline Failover**
   * Automatically switches between **Firebase Cloud Firestore** (online) and **LocalStorage** (offline).
   * Automatically syncs offline guest data to your cloud account upon registration.

---

## 🛠️ Technology Stack & Frameworks

* **Frontend Library**: [React 19](https://react.dev/) (`^19.2.6`)
* **Build Tool**: [Vite 8](https://vite.dev/) (`^8.0.12`)
* **Backend BaaS**: [Google Firebase](https://firebase.google.com/) (`^12.15.0`)
  * Firebase Authentication
  * Cloud Firestore Document Database
  * Firebase AI Generative Model SDK
* **Mock database / Local mode API simulation**: `json-server` (`^0.17.4`)
* **Local server host script**: Node.js utilizing `server.cjs`
* **Fonts**: Google Fonts (`DotGothic16`, `Inter`)

---

## 💻 Local Installation & Setup

Follow these steps to run the application on your computer:

### 1. Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v18 or higher recommended).

### 2. Clone and Install Dependencies
Navigate to your project directory in your terminal and install all required framework packages:
```bash
# Install dependencies
npm install
```

### 3. Start the Development Server
Launch Vite's fast local development server:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build and Launch Production Build
To create a production-optimized package and launch the Node.js server:
```bash
# Build Vite bundles
npm run build

# Start local server hosting dist outputs
npm start
```
By default, the server runs on [http://localhost:3000](http://localhost:3000).

---

## 🔑 Firebase Credentials Initialization

If you are running the app for the first time and your Firebase configurations are missing:
1. The Login page will render a **Firebase API Setup Required** dashboard.
2. Go to your [Firebase Console](https://console.firebase.google.com/), create a Web App under your project, and retrieve the config object keys.
3. Paste the credentials (`API Key`, `Project ID`, `Auth Domain`, etc.) into the form and click **Initialize Database**.
4. The system will save your config to browser LocalStorage and connect.
5. Alternatively, you can click **Skip configuration and continue as Guest** to run the app in Local Offline Mode.
