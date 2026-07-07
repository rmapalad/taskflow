# 🍀 FourLeaf Finance - System Documentation & Progress Report
**Retro-Inspired Brutalist Transaction & Budget Tracker**

This document serves as the system documentation and progress report for the **FourLeaf Finance** application. It details the project context, framework stack, migration history, development progress, user interface stages, code syntax, system features, and design enhancements.

---

## 📁 1. Project Information & Framework Stack

* **Project Name**: FourLeaf Finance (referred to as Mapalad in core assets and directories)
* **Application Concept**: A high-performance, retro-inspired, brutalist personal finance application combining traditional ledger logging, budget planning, bill tracking, and wants allocations with real-time Firestore database replication and local offline synchronization. 
* **Target Users**: Individuals seeking a lightweight, high-contrast, clutter-free application for daily financial tracking.
* **Core Technology Stack & Frameworks**:
  * **React 19 (`^19.2.6`)**: Selected as the core SPA framework. Handles component encapsulation, virtual DOM updates, reactive states, hooks (e.g., `useState`, `useEffect`, `useCallback`, `useMemo`), and component lifecycle events.
  * **Vite (`^8.0.12`)**: Serves as the modern build tool and bundler. Replaces slow legacy configurations with Hot Module Replacement (HMR) for fast local dev updates.
  * **Google Firebase (`^12.15.0`)**: Utilized as the backend-as-a-service (BaaS) database and authentication provider. Includes:
    * **Cloud Firestore**: Real-time Document database for multi-tenant transactions ledger sync.
    * **Firebase Auth**: Secures client sessions.
    * **Firebase AI SDK**: Integrates AI prompts with Gemini.
  * **JSON-Server (`^0.17.4`)**: Originally integrated to mock API calls on local environments; its schema structure is kept as the state label for online Firebase queries (`json-server` mode).
  * **Node.js**: Powers local server configs using `server.cjs` to host dist outputs.
  * **Styling**: Native CSS3 with custom brutalist typography (`DotGothic16` and `Inter`) and CSS variables
  * **Offline Sync**: LocalStorage client-side wrapper with automated background sync
* **Current Percentage of Completion**: **72%**

---

## 🔄 2. Architecture Migration History

### Evolution from Static Baseline to Reactive SPA
The current iteration of FourLeaf Finance is the result of a significant architecture migration:
1. **The Legacy Stack (Baseline)**: The application was originally conceived as a static web layout built using vanilla **HTML5, native CSS3 sheets, and raw ES5 JavaScript**. While this served well as a visual proof-of-concept, it lacked centralized state management, suffered from DOM-manipulation clutter, and ran entirely offline without user segmentation or data persistence across devices.
2. **The Modern Framework Migration**: To solve these limitations, the application was fully migrated to **React 19** powered by **Vite** for optimized building. State was centralized into React contexts and hooks in `App.jsx`. Data operations were modularized into a standardized API client (`api.js`), replacing ad-hoc DOM bindings with reactive variables.
3. **Database Integration**: Static data arrays were replaced with a dual-layer storage engine connecting Google Cloud Firestore for secure online cloud access, and falling back automatically to LocalStorage caches when offline. User management was migrated to Firebase Auth, enabling secure multi-tenant profiles.

---

## 📈 3. Development Progress Summary

### Overview of Developed Features
FourLeaf Finance is designed around a dual-database model. In online mode, records write to Google Cloud Firestore via the `api.js` wrapper; if network latency spikes or connectivity fails, it triggers an automated failover to client-side LocalStorage. The app simulates custom accounts by mapping username inputs into alphanumeric email structures (`username@fourleaffinance.com`).

The ledger features keyword searches, category filters, and descending chronological lists paginated to 10 entries per page. Spend limits trigger color warnings (shifting progress bars from custom category themes to bright brutalist red). The Wants Allocation module applies a custom slider percentage to monthly income, tracks active desires, and integrates a **Gemini 3.5 Flash** trade-off advisor to recommend behavioral adjustments. Collapsible accordion guides explain the underlying math.

### Active Development
Current work focuses on finalizing the financial reports dashboard to compile categories into printable reports. In parallel, developers are building a Goals Milestone module to track savings targets against the net balance calculated by `App.jsx`. 

### Challenges Encountered
1. **Dual-Layer Database Sync**: Synchronizing local guest inputs with Firestore collections upon account creation required a clean transaction buffer. This was solved by flagging local keys with `sync_pending` in `api.js` and performing background imports upon success.
2. **AI Math Hallucinations**: Standard LLMs often hallucinate computations on raw logs. We resolved this by pre-aggregating cash flows client-side in `aiAdvisor.js` and passing preprocessed constants under a strict prompt constraint instructing Gemini to treat them as ground truth.
3. **Vanilla CSS Adaptability**: Fitting brutalist styles (bold borders, drop shadows, rigid containers) into responsive layouts was challenging. We solved this by using flexible Grid layouts that collapse from three columns to single columns on small screen ports.

---

## 🤖 4. Flagship Feature: AI Financial Advisor

The crown jewel of FourLeaf Finance is the **AI Financial Advisor**, powered directly by **Gemini 3.5 Flash** via the Firebase AI SDK integration. Unlike generic chatbots, the AI Advisor is deeply integrated into the user's personal balance sheets.

### Dual-Advisor Intelligence
The AI Advisor operates in two separate contexts:
1. **Macro Cash Flow Advisor (`AnalyticsView.jsx`)**:
   Triggered on the Analytics page, it processes the user's spending trends across day, week, month, or year timeframes. It breaks down spending into three distinct tiers:
   * **Fixed Essentials (Non-Negotiable)**: Overhead costs like rent and utilities. The AI is hard-coded *not* to suggest cuts here.
   * **Variable Essentials (Optimizable)**: Necessities that can be made more efficient (e.g., energy consumption, transit).
   * **Discretionary Spending (Alterable)**: The primary coaching target (dining out, entertainment).
2. **Wants Trade-Off Strategist (`WantsView.jsx`)**:
   Triggered by clicking the **"Ask Advisor"** button on individual items in the Wants wishlist. It calculates the user's financial gap to buy the item and creates a behavioral sacrifice plan showing how replacing specific discretionary habits can fund that purchase.

### Technical Guardrails & Localizations
* **Math Guardrail**: To prevent AI math hallucinations, all totals, averages, and percentages are pre-calculated client-side in Javascript. These calculations are passed to Gemini as absolute constants, ensuring financial summaries match the ledger.
* **PH-Specific Recommendations**: The Advisor is programmed with Philippine localization rules, actively recommending localized wealth-building tools:
  * **Pag-IBIG MP2 (Modified Pag-IBIG 2)**: Tax-free government savings programs showing high dividend yields.
  * **Digital Banks (Maya, GoTyme, Tonik)**: Regulated high-interest stashes to house emergency funds.
* **Interactive Markdown Renderer**: The AI outputs custom markdown which is parsed in real time into clean HTML by a custom parser in `aiAdvisor.js`, highlighting monetary values (₱ and PHP) in bold green terminal fonts.

---

## 🖥️ 5. UI Pages Progress

The application consists of **10 functional pages** or view states. The table below outlines their status:

| View | Page Purpose & Description | Current Development Status | Improvements Since Progress Report 1 |
| :--- | :--- | :--- | :--- |
| **1. Login Portal** | Secures access, initializes custom Firestore configurations, and supports guest skip options. | **Completed** | Added a toggle button for password visibility, error shaking animation, and dynamic database status indicators. |
| **2. Dashboard Overview** | Aggregates income, lifetime balances, category limits, and plots running daily balances. | **Completed** | Integrated a canvas-based sparkline that automatically redraws balance curves based on filtered monthly inputs. |
| **3. Transactions Ledger** | Logs, searches, edits, and paginates income and expense records. | **Completed** | Added dual-sorting filters (sort by Date or Amount) and smooth form auto-scrolling on edit clicks. |
| **4. Budget Limits** | Tracks category spending ceilings and monitors utilization progress bars. | **Completed** | Configured warnings to change progress colors to red upon overspend thresholds. |
| **5. Bills Tracker** | Tracks upcoming bills, priorities, due dates, and recurrent cycles. | **Completed** | Built an auto-logging function linking bills directly to transactions as soon as "Mark Paid" is clicked. |
| **6. Wants Allocation** | Helps allocate wants allowances based on total incomes and priorities. | **Completed** | Embedded the Gemini Want Advisor modal, calculating cash gaps needed to fund wishlist purchases. |
| **7. Analytics** | Renders transaction breakdowns and triggers Gemini AI Advisor insights. | **In Progress (75%)** | Configured custom HTML5 Canvas donut and bar chart elements rendering category divisions. |
| **8. User Profile** | Manages configurations, sync triggers, database mode toggles, and data wipes. | **In Progress (60%)** | Built local backup restoration triggers to pull cached tables back to Firestore. |
| **9. Contact Us** | Collects inquiry details and hosts a upvote-driven Suggestion Board. | **Completed** | Added spam constraints locking upvotes to one per session via LocalStorage arrays. |
| **10. About App** | Provides a list of instructions, features definitions, and collapsible FAQs. | **Completed** | Styled native `<details>` summaries into responsive brutalist collapsible containers. |

---

## 💻 6. Key Syntax Evidence

Below is code evidence from the codebase, showcasing semantic markup, styling classes, and core JavaScript/React handlers.

### 🤖 Flagship Feature: Gemini AI Advisor Integration
* **Gemini Model Query Handler (`aiAdvisor.js`)**:
  ```javascript
  const model = getGenerativeModel(ai, {
    model: 'gemini-3.5-flash',
    systemInstruction
  });

  const promptText = `
  Timeframe Filter: ${timeframe}
  Aggregated Financial Data for this Timeframe:
  - Total Income: ₱${preprocessed.incomeTotal.toFixed(2)}
  - Total Expenses: ₱${preprocessed.expenseTotal.toFixed(2)}
  - Net Savings/Deficit: ₱${preprocessed.netBalance.toFixed(2)}

  Expense Category Breakdown by Tiers:
  1. Fixed Essentials: ₱${preprocessed.fixed_essentials?.total}
  2. Variable Essentials: ₱${preprocessed.variable_essentials?.total}
  3. Discretionary Spending: ₱${preprocessed.discretionary?.total}
  `;

  const result = await model.generateContent(promptText);
  return result.response.text();
  ```
  *Explanation: Instantiates the `gemini-3.5-flash` model, passing client-side pre-processed data structures alongside system constraints to generate targeted personal advice without hallucinating calculations.*

* **Currency Highlight Regex Parser (`aiAdvisor.js`)**:
  ```javascript
  // Highlight monetary amounts (e.g. ₱5,000, 1,200 PHP, PHP 500)
  const currencyRegex = /(-?₱\s*\d+(?:,\d{3})*(?:\.\d+)?|-?\d+(?:,\d{3})*(?:\.\d+)?\s*PHP|-?PHP\s*\d+(?:,\d{3})*(?:\.\d+)?)/gi;
  resultHtml = resultHtml.replace(currencyRegex, '<span class="ai-highlight-amount">$1</span>');
  ```
  *Explanation: Scans the raw markdown response from Gemini and replaces currency structures with a styled highlight class, applying a custom green color scheme.*

---

### 🔐 1. Login & Registration Portal
* **HTML/JSX Structure (`LoginPortal.jsx`)**:
  ```jsx
  <form className="login-form" onSubmit={handleAuthSubmit} noValidate>
    <div className="input-container">
      <label htmlFor="username">Username</label>
      <input
        type="text"
        id="username"
        autoComplete="username"
        required
        disabled={isLoading}
        placeholder="Enter username..."
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
    </div>
    ...
    <button type="submit" className="btn-login" disabled={isLoading}>
      <span>{isLoading ? 'CONNECTING' : 'ACCESS PORTAL'}</span>
      {isLoading && <span className="caret-blink"></span>}
    </button>
  </form>
  ```
  *Explanation: Employs explicit `htmlFor` attributes to connect label tags to input elements, improving accessibility for screen readers. It locks inputs during submission.*
* **CSS Styling (`login.css`)**:
  ```css
  .btn-login {
      background-color: var(--text-main);
      color: #ffffff;
      border: none;
      padding: 14px;
      border-radius: var(--radius);
      font-weight: 600;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 1px;
      cursor: pointer;
      transition: all 0.2s ease;
  }
  .caret-blink {
      display: inline-block;
      width: 8px;
      height: 14px;
      background-color: currentColor;
      animation: caretBlink 0.8s steps(2, start) infinite;
  }
  ```
  *Explanation: Implements brutalist styling attributes including uppercase lettering, letter spacing, and a blinking cursor animation to resemble retro command-line interfaces.*
* **JavaScript Login Handler (`LoginPortal.jsx`)**:
  ```javascript
  const usernamePart = cleanUsernameDisplay(cleanUsername);
  const sanitizedUsername = usernamePart.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  const email = `${sanitizedUsername}@fourleaffinance.com`;

  if (mode === 'login') {
    let userCredential;
    try {
      userCredential = await signInWithEmailAndPassword(auth, email, cleanPassword);
    } catch (loginErr) {
      if (loginErr.code === 'auth/user-not-found' || loginErr.code === 'auth/invalid-credential') {
        const oldEmail = `${sanitizedUsername}@mapalad.com`;
        userCredential = await signInWithEmailAndPassword(auth, oldEmail, cleanPassword);
      } else {
        throw loginErr;
      }
    }
  }
  ```
  *Explanation: Dynamically converts simple username strings into simulated emails while maintaining backward compatibility with `@mapalad.com` database collections.*

---

### 📊 2. Dashboard Overview
* **HTML/JSX Structure (`DashboardView.jsx`)**:
  ```jsx
  <div className="card">
    <h2>Running Balance</h2>
    <div className="amount" id="dashboard-total-balance">
      {formatCurrency(totalBalance)}
    </div>
    <div className="sparkline-container">
      <canvas ref={canvasRef} width="300" height="40"></canvas>
    </div>
  </div>
  ```
  *Explanation: Uses standard semantic headings with an HTML5 `<canvas>` node to draw monthly balance sparklines directly inside dashboard widgets.*
* **Canvas Drawing Script (`DashboardView.jsx`)**:
  ```javascript
  const stepX = width / (data.length - 1);
  ctx.clearRect(0, 0, width, height);

  ctx.beginPath();
  ctx.moveTo(0, height);
  data.forEach((val, i) => {
    const x = i * stepX;
    const y = range === 0 ? height / 2 : height - (((val - minData) / range) * (height - 6) + 3);
    ctx.lineTo(x, y);
  });
  ctx.lineTo(width, height);
  ctx.closePath();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
  ctx.fill();
  ```
  *Explanation: Iterates chronologically over filtered transactions to map values into (X, Y) pixel coordinates, creating a shaded gradient underneath.*

---

### 💸 3. Transactions Ledger
* **HTML/JSX Filters (`TransactionsView.jsx`)**:
  ```jsx
  <div className="form-group" style={{ flex: 2 }}>
    <label htmlFor="tx-search">Search Keyword</label>
    <input
      id="tx-search"
      type="text"
      placeholder="Search description..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  </div>
  ```
  *Explanation: Provides accessible forms containing labels linked to dynamic React state listeners to filter transactions in real time.*
* **JS Search & Pagination Filters (`TransactionsView.jsx`)**:
  ```javascript
  const filtered = transactions.filter((t) => {
    const matchesSearch = t.description?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory === 'All' || t.category === filterCategory;
    const matchesType = filterType === 'All' || t.type === filterType;
    const matchesMonth = t.date && t.date.substring(0, 7) === currentMonth;
    return matchesSearch && matchesCategory && matchesType && matchesMonth;
  });
  ```
  *Explanation: Implements client-side query logic, combining keyword searches, categories, transaction types, and months prior to pagination divisions.*

---

### 🎯 4. Budget Limits
* **Budget Limits Table (`BudgetsView.jsx`)**:
  ```jsx
  const limitVal = budgetLimits[cat] || 0;
  const spentVal = categoryExpenses[cat] || 0;
  const isOver = spentVal > limitVal && limitVal > 0;
  const barWidth = limitVal > 0 ? Math.min((spentVal / limitVal) * 100, 100) : 0;
  const barColor = isOver ? 'var(--accent-red)' : categoriesMetadata[cat].color;

  return (
    <tr key={cat}>
      <td>{cat}</td>
      <td className={isOver ? 'text-red font-bold' : ''}>{formatCurrency(spentVal)}</td>
      <td>{formatCurrency(limitVal)}</td>
      <td>
        <div className="progress-bar-bg">
          <div style={{ width: `${barWidth}%`, backgroundColor: barColor, height: '100%' }}></div>
        </div>
      </td>
    </tr>
  );
  ```
  *Explanation: Dynamically maps the background color and width of progress indicators, flashing them red as warning nodes if spent balances exceed budget thresholds.*

---

### 📅 5. Bills Tracker
* **Auto-Transaction Creator (`BillsView.jsx`)**:
  ```javascript
  const promptAutoExpense = async (bill) => {
    const confirmLog = confirm(`Would you like to automatically log "${bill.title}" as an Expense transaction?`);
    if (confirmLog) {
      await onAddTransaction({
        date: getTodayDateString(),
        description: bill.title,
        category: 'Subscriptions',
        type: 'expense',
        amount: parseFloat(bill.amount) || 0
      });
      showToast('Expense transaction logged successfully!');
    }
  };
  ```
  *Explanation: Creates a matching transaction in the global ledger whenever a bill status is updated, saving the user from double-logging entries.*

---

### 🎁 6. Wants Allocation
* **Wants Dynamic Math Calculations (`WantsView.jsx`)**:
  ```javascript
  let totalIncome = 0;
  let totalExpenses = 0;
  transactions.forEach((t) => {
    const amt = parseFloat(t.amount) || 0;
    if (t.type === 'income') totalIncome += amt;
    else if (t.type === 'expense') totalExpenses += amt;
  });

  const totalBalance = totalIncome - totalExpenses;
  const allocableBudget = Math.max(0, totalBalance * (wantsAllocationPct / 100));
  ```
  *Explanation: Integrates the 50/30/20 budget framework. Allocates a customizable portion of net savings for luxury items.*

---

### 📊 7. Analytics
* **Category Summarization Groupings (`AnalyticsView.jsx`)**:
  ```javascript
  const categoryTotals = {};
  filteredTransactions.forEach((t) => {
    if (t.type === 'expense') {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + (parseFloat(t.amount) || 0);
    }
  });
  ```
  *Explanation: Consolidates transactions by categories to feed chart drawing functions, minimizing loops in rendering routines.*

---

### 👤 8. User Profile
* **Database Mode Toggling (`ProfileView.jsx`)**:
  ```jsx
  <div className="setting-control">
    <button className="btn-action" onClick={onToggleDbMode}>
      {dbMode === 'json-server' ? 'Disconnect Server (Go Offline)' : 'Connect Firebase (Go Online)'}
    </button>
    <p className="setting-desc">
      Currently using: <strong>{dbMode === 'json-server' ? 'Firebase Cloud Database' : 'LocalStorage Offline Mode'}</strong>
    </p>
  </div>
  ```
  *Explanation: Triggers a state handler that switches communication endpoints from Firestore Web APIs to local browser storages.*

---

### ✉️ 9. Contact Us
* **Dynamic Form Placeholders (`ContactView.jsx`)**:
  ```javascript
  const getMessagePlaceholder = () => {
    switch (contactSubject) {
      case 'User Suggestion':
        return 'What feature would make this app better for you? How would you use it?';
      case 'Technical Support':
        return 'Describe the technical issue you are experiencing, including any steps to reproduce...';
      default:
        return 'Describe your inquiry in detail here...';
    }
  };
  ```
  *Explanation: Returns user-friendly placeholders dynamically based on dropdown values, guiding input queries.*

---

### ℹ️ 10. About App
* **Collapsible FAQ Accordion Structure (`AboutView.jsx`)**:
  ```html
  <details className="faq-item">
    <summary className="faq-question">
      <span>How does guest mode transition to logged-in user mode?</span>
      <span className="faq-icon">▼</span>
    </summary>
    <div className="faq-answer">
      When you use the app as a guest, all transactions, wants, and bills are cached in your browser's local storage.
      When you register or log in, FourLeaf Finance detects these local items and automatically pushes them to your secure Firestore cloud account.
    </div>
  </details>
  ```
  *Explanation: Employs semantic native `<details>` and `<summary>` tags to construct FAQ accordions, avoiding complex JS libraries.*

---

## 📸 7. Functional Features Evidence

This section outlines how to perform key workflows in the application.

### 1. Registration Process
* **How it Works**: Users navigate to the Portal and click **"Register"**. The system converts the entered username into an email string (e.g. `jane@fourleaffinance.com`) and registers the user via Firebase Auth.
* **Suggested Screenshot Capture**: Select the registration tab, input a new name and password, and take a screenshot before clicking "Create Account".
* **Placeholder**:
  `![Registration Interface Setup](file:///c:/Users/rmapa/Desktop/TaskFlow_Mapalad/screenshots/1_registration_portal.png)`

### 2. Login Process
* **How it Works**: Registered users enter their password, which is authenticated by Firestore. The UI updates the connection state and displays a "Firebase Auth Connected" banner.
* **Suggested Screenshot Capture**: Focus on the Login Portal card showing a green dot indicating a connected Firebase database.
* **Placeholder**:
  `![Security Login Interface](file:///c:/Users/rmapa/Desktop/TaskFlow_Mapalad/screenshots/2_login_portal.png)`

### 3. Dashboard Functionality
* **How it Works**: Displays lifetime totals alongside month filters. The sparkline canvas plots the daily balance trend.
* **Suggested Screenshot Capture**: Take a screenshot of the top card container row showing the balance cards and the black curve of the sparkline chart.
* **Placeholder**:
  `![Dashboard Widgets & Balance Sparkline](file:///c:/Users/rmapa/Desktop/TaskFlow_Mapalad/screenshots/3_dashboard.png)`

### 4. Navigation Menu
* **How it Works**: The sidebar controls the active viewport using click triggers. If the screen shrinks to mobile, the navigation collapses into a hamburger slide-out menu.
* **Suggested Screenshot Capture**: Capture the sidebar list with highlighted left-border accents indicating the active tab.
* **Placeholder**:
  `![Sidebar Navigation Links](file:///c:/Users/rmapa/Desktop/TaskFlow_Mapalad/screenshots/4_navigation.png)`

### 5. Forms
* **How it Works**: Forms validate input ranges (e.g., locking negative transactions) and trigger toast alerts upon database confirmations.
* **Suggested Screenshot Capture**: Capture a form (like "Set Budget Limits") filled out right before submission.
* **Placeholder**:
  `![Form Input Validation](file:///c:/Users/rmapa/Desktop/TaskFlow_Mapalad/screenshots/5_transaction_form.png)`

### 6. Search / Filter Features
* **How it Works**: Filters transactions in the ledger table. Page counts update automatically based on matching results.
* **Suggested Screenshot Capture**: Input a keyword like "Rent" in the search box to capture the filtered list.
* **Placeholder**:
  `![Transaction Search Filtering](file:///c:/Users/rmapa/Desktop/TaskFlow_Mapalad/screenshots/6_search_filters.png)`

### 7. Flagship Feature: AI Financial Insights & Wants Strategy
* **How it Works**: Triggered on the Analytics view or Wants wish list. Passes cash gaps to Gemini 3.5 Flash, generating tailored saving schedules and investment locations in regulated digital banks or government bonds.
* **Suggested Screenshot Capture**: Open the "Wants Advisor" modal on a high-priority item (like a keyboard) to show the Gemini-rendered tradeoff recommendations.
* **Placeholder**:
  `![AI Want Advisor Behavioral Tradeoffs Modal](file:///c:/Users/rmapa/Desktop/TaskFlow_Mapalad/screenshots/7_ai_tradeoff_advisor.png)`

---

## 🎨 8. UI/UX Enhancement Progress

### Spacing and Layout
We replaced compact elements with a clean Grid layout. We added `box-sizing: border-box` and margins globally, preventing containers from clipping at the screen boundaries.

### Consistent Color Scheme
The app uses a strict brutalist color palette defined in `styles.css`:
* Primary backgrounds (`#f4f4f4` / `#fcfcfc`)
* High-contrast borders (`#cccccc` / `#111111`)
* Theme indicators (`#a33e3e` error red, `#3e7a4b` success green)

### Typography
We replaced browser default fonts with Google Fonts:
* **Headers**: `DotGothic16` (monospace terminal feel)
* **Body Text**: `Inter` (readable UI sizing)

### Hover Effects and Animations
Hover rules highlight active cards. Form buttons scale down slightly on clicks, and input fields light up with subtle shadows when active.

### Responsive Design
Using media queries, components stack vertically on mobile layouts. Page containers toggle the scroll behavior dynamically to prevent double-scroll loops.

### Before & After Comparison

| Component | Before Enhancements (Progress Report 1) | After Enhancements (Current) |
| :--- | :--- | :--- |
| **Borders & Shadows** | 1px light gray borders; flat look. | Solid 1px black borders with heavy box-shadow offsets (`box-shadow: 4px 4px 0px 0px var(--text-main)`). |
| **Grid Column Gaps** | Tight, unpadded columns with layout shift risks. | Unified grids using `grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))` with `gap: 24px`. |
| **Navigation** | Sticky text headers with no active state indicators. | Sidebar featuring cursor pointers and vertical borders indicating the active view. |
| **FAQ Sections** | Static lists that cluttered the view. | Native collapsible accordions that expand on clicks. |

---

## 📋 9. Action Action Plan for Final Submission

To reach 100% completion before the final deadline, we will prioritize:
1. **Goals Milestones Widget**: Connect the upcoming savings targets widget to the Wants and Balance systems.
2. **Offline Conflict Resolver**: Add a verification window when syncing guest data to handle duplicate transaction conflicts.
3. **PDF Exporter**: Add client-side printing libraries to let users export summaries directly to PDF.
