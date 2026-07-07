# Mapalad - System Documentation
**Retro-Inspired Brutalist Transaction & Budget Tracker**

This documentation details the pages, workflows, UI/UX configurations, and technical implementation of the Mapalad application.

---

## 🎨 Global UI/UX Design System (:root Variables)
Mapalad uses a minimalist, high-contrast, brutalist design token system defined via CSS variables. This ensures visual consistency across all views.

```css
:root {
    --bg-body: #f4f4f4;       /* Base background */
    --bg-app: #fcfcfc;        /* App main container container */
    --text-main: #111111;     /* Primary text color */
    --text-muted: #666666;    /* Secondary/Muted text */
    --border-color: #cccccc;  /* Boxy brutalist borders */
    --accent-red: #a33e3e;    /* Error & budget overrun highlights */
    --accent-green: #3e7a4b;  /* Success & income indicator */
    --radius: 4px;            /* Boxy border radius */
}
```

---

## 1. 🔐 Page: Login & Registration Portal

### Page Overview
The Login/Registration Portal is the gateway to the application. It provides user access to Mapalad's dashboard. It secures and segments user data, ensuring transaction histories remain private.
- **Connection to System Workflow**: If a user is not logged in (`isLoggedIn === null`), the app renders this portal as a blocker. Successful login feeds user state to `App.jsx`, triggering data fetching.

### Key Syntax
#### HTML Structure & Semantics
```html
<section className="login-container">
  <div className="login-box">
    <h1>MAPALAD <span>BUDGET</span></h1>
    <form onSubmit={handleAuthSubmit}>
      <div className="form-group">
        <label htmlFor="login-username">SECURITY USERNAME</label>
        <input id="login-username" type="text" required value={username} onChange={e => setUsername(e.target.value)} />
      </div>
      ...
    </form>
  </div>
</section>
```
*Description: Semantic structural container utilizing `<section>` and `<form>` tags for accessibility. Inputs bind explicitly to HTML labels.*

#### Firebase Authentication & Sanitization (JS)
```javascript
// Sanitizes input username and logs in via Firebase Auth
const usernamePart = cleanUsername.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
const email = `${usernamePart}@mapalad.com`;

if (mode === 'login') {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  localStorage.setItem('firebase_uid', userCredential.user.uid);
  onLoginSuccess(usernamePart, true);
}
```
*Description: Sanitizes alphanumeric input strings into simulated email addresses (`username@mapalad.com`) to allow simple username sign-ins using Firebase Auth.*

### Output Screenshots
- **Desktop View**: `![Desktop View - Login Portal](path/to/screenshots/login_desktop.png)` *(Place high-quality desktop login capture here)*
- **Mobile View**: `![Mobile View - Login Portal](path/to/screenshots/login_mobile.png)` *(Place high-quality mobile login capture here)*

### Technical Explanation
- **Accessibility**: Employs explicit `htmlFor` properties on labels to connect them to input fields, making inputs accessible to screen readers.
- **CSS Layout**: Relies on a flexbox center-alignment grid (e.g. `display: flex; align-items: center; justify-content: center;`) with dark drop-shadow vectors (`box-shadow: 8px 8px 0px 0px var(--text-main);`) that align with brutalist principles.
- **JavaScript Functionality**: Manages form submission asynchronously with state indicators (`isLoading`), logging failures using friendly error mappings.

---

## 2. 📊 Page: Dashboard Overview

### Page Overview
The Overview page serves as the landing homepage. It features visual aggregations of monthly income, lifetime balance, wants utilization, and category thresholds.
- **Connection to System Workflow**: Acts as the default page. Loads and recalculates financial statistics dynamically whenever transactions are added, edited, or deleted.

### Key Syntax
#### Canvas Rendering Sparkline (JS)
```javascript
// Chronological sparkline plotting running balance
ctx.beginPath();
ctx.moveTo(0, height);
data.forEach((val, i) => {
  const x = i * stepX;
  const y = height - (((val - minData) / range) * (height - 6) + 3);
  ctx.lineTo(x, y);
});
ctx.lineTo(width, height);
ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
ctx.fill();
```
*Description: Takes a chronological array of transaction values, plots them across a `<canvas>` element using 2D drawing methods, and renders a shaded area reflecting daily balance fluctuations.*

### Output Screenshots
- **Desktop View**: `![Desktop View - Dashboard](path/to/screenshots/dashboard_desktop.png)` *(Place home desktop dashboard capture here)*
- **Mobile View**: `![Mobile View - Dashboard](path/to/screenshots/dashboard_mobile.png)` *(Place home mobile dashboard capture here)*

### Technical Explanation
- **Responsiveness**: Utilizes standard CSS grid systems (`grid-template-columns: repeat(3, 1fr)`) which collapse into single columns on mobile displays.
- **Canvas Details**: Monitors changes to the filtered transaction lists inside a `useEffect` hook, clearing and redraws coordinates on window resize.

---

## 3. 💸 Page: Transactions Ledger

### Page Overview
The Transactions view handles log lists. It enables auditing and managing inputs (Incomes) and outputs (Expenses) mapped to specified date filters.
- **Connection to System Workflow**: Modifies the global `transactions` state. Feeds calculations inside the Budgets, Wants, and Analytics views.

### Key Syntax
#### Inline Transaction Form (HTML/JSX)
```html
<form id="transaction-form" onSubmit={handleSubmit}>
  <div className="form-group">
    <label htmlFor="tx-category">Category</label>
    <select id="tx-category" value={category} onChange={e => setCategory(e.target.value)}>
      {Object.keys(categoriesMetadata).map(cat => (
        <option key={cat} value={cat}>{cat}</option>
      ))}
    </select>
  </div>
  ...
  <button type="submit" className="btn-submit">Add Log</button>
</form>
```
*Description: Semantic dropdown selects and numeric entry inputs feeding transaction records directly to memory arrays and databases.*

### Output Screenshots
- **Desktop View**: `![Desktop View - Transactions](path/to/screenshots/transactions_desktop.png)` *(Place desktop transactions view capture here)*
- **Mobile View**: `![Mobile View - Transactions](path/to/screenshots/transactions_mobile.png)` *(Place mobile transactions view capture here)*

### Technical Explanation
- **Data Pipelines**: Submissions dispatch to an `apiClient` mapping. Records are posted directly to Firestore (`suggestions` collections) when online, buffering to LocalStorage if offline.

---

## 🎯 4. Page: Budget Limits

### Page Overview
Enables allocating cap allowances per category to restrict excessive spending.
- **Connection to System Workflow**: Compares budget thresholds against monthly transactions, updating remaining budgets in real time.

### Key Syntax
#### Overspend Highlights (JSX/CSS)
```jsx
const remainingVal = limitVal - spentVal;
const isOver = remainingVal < 0;
const barColor = isOver ? 'var(--accent-red)' : catMeta.color;

return (
  <tr>
    <td className={isOver ? 'text-red' : 'text-green'}>
      {isOver ? 'Overspent' : 'Under'}
    </td>
    <td>
      <div className="progress-bar-bg">
        <div style={{ width: `${barWidth}%`, backgroundColor: barColor }}></div>
      </div>
    </td>
  </tr>
);
```
*Description: Controls progress bar width and toggles color palettes based on budget calculations, turning warnings red on overrun.*

### Output Screenshots
- **Desktop View**: `![Desktop View - Budgets](path/to/screenshots/budgets_desktop.png)` *(Place budgets overview capture here)*
- **Mobile View**: `![Mobile View - Budgets](path/to/screenshots/budgets_mobile.png)` *(Place budgets overview mobile capture here)*

### Technical Explanation
- **Calculations**: Filters transactions for the active month, groups spent values by category, and updates progress bars.

---

## 📅 5. Page: Bills Tracker

### Page Overview
Manages recurring bills and due dates.
- **Connection to System Workflow**: Marking a bill as paid automatically creates a transaction.

### Key Syntax
#### Posting Bill to Transaction (JS)
```javascript
const handleMarkPaid = async (bill) => {
  const transactionPayload = {
    id: Date.now(),
    category: 'Utilities & Bills',
    amount: bill.amount,
    type: 'expense',
    date: new Date().toISOString().split('T')[0],
    description: `Paid Bill: ${bill.name}`
  };
  await onAddTransaction(transactionPayload);
  await onUpdateBill(bill.id, { ...bill, status: 'paid' });
};
```
*Description: Generates a new transaction and updates bill statuses, linking bills directly to database ledgers.*

---

## 🎁 6. Page: Wants Allocation

### Page Overview
Features wants percentage allocation limits matching actual monthly income.
- **Connection to System Workflow**: Reads monthly income, applies wants percentages, and updates available balances based on desire lists.

### Key Syntax
#### Wants Balance Calculations (JS)
```javascript
const monthlyIncome = transactions
  .filter(t => t.type === 'income' && t.date.substring(0,7) === currentMonth)
  .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);

const allocatedWants = (monthlyIncome * wantsAllocationPct) / 100;
const spentWants = wants
  .filter(w => w.status === 'purchased')
  .reduce((sum, w) => sum + (parseFloat(w.amount) || 0), 0);

const remainingWantsPool = allocatedWants - spentWants;
```
*Description: Dynamically calculates remaining wants budgets from income, wants limits, and want purchases.*

---

## 📊 7. Page: Analytics

### Page Overview
Visualizes budget allocations, income vs expense breakdowns, and category utilization.

### Key Syntax
#### Aggregate Analytics Groupings (JS)
```javascript
const categorySummary = transactions.reduce((acc, curr) => {
  if (curr.type === 'expense') {
    acc[curr.category] = (acc[curr.category] || 0) + parseFloat(curr.amount);
  }
  return acc;
}, {});
```
*Description: Groups and aggregates transactions by category to feed analytical views.*

---

## 👤 8. Page: User Profile

### Page Overview
Coordinates application states, manages synchronization, and handles resets.

### Key Syntax
#### Mode Toggle Integration (JS)
```javascript
const handleToggleDbMode = async () => {
  if (dbMode === 'json-server') {
    setDbMode('localstorage');
    showToast('Switched to Local Offline Mode.');
  } else {
    setDbMode('json-server');
    showToast('Connected to Firebase Server.');
  }
};
```
*Description: Toggles databases between Firebase Cloud and local storage modes.*

---

## ✉️ 9. Page: Contact Us

### Page Overview
Features an inquiry form and a public suggestion board.
- **Connection to System Workflow**: Saves inquiry forms to databases and runs suggestion/upvote modules.

### Key Syntax
#### Dynamic Inquiry Placeholders (JS)
```javascript
const getMessagePlaceholder = () => {
  if (contactSubject === 'User Suggestion') {
    return 'What feature would make this app better for you? How would you use it?';
  }
  return 'Describe your inquiry in detail here...';
};
```
*Description: Adjusts text placeholders dynamically based on subject selections.*

#### Suggestion Upvote Increments (JS/Firebase)
```javascript
const docRef = doc(db, 'suggestions', sId);
await updateDoc(docRef, {
  upvotes: increment(1)
});
setUpvotedIds(prev => [...prev, sId]);
```
*Description: Increments upvotes in Firestore and updates local arrays to block multiple upvotes.*

---

## ℹ️ 10. Page: About App

### Page Overview
Displays guides and collapsible FAQs.

### Key Syntax
#### Interactive FAQ Accordion (HTML)
```html
<details className="faq-item">
  <summary className="faq-question">
    <span>How is the Wants budget calculated?</span>
    <span className="faq-icon">▼</span>
  </summary>
  <div className="faq-answer">
    It multiplies your monthly income by your Wants Allocation percentage.
  </div>
</details>
```
*Description: Styled collapsible FAQ cards using native details elements.*

---

## 🎨 UI/UX Enhancement Evidence
Mapalad features several enhancements:
1. **Interactive Canvas Charts**: Replaces static graphics with HTML5 canvas charts.
2. **Brutalist Cards & Borders**: Clean alignments, box-shadows, and layout spacing.
3. **Adaptive Placeholders**: Subject dropdown selection changes input fields dynamically.
4. **Interactive Accordions**: Clean transitions on summary triggers.
5. **Toast Warnings**: Animated alerts indicating save confirmations.
