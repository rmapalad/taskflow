// Database Mode and Seed Data
let dbMode = 'json-server'; // 'json-server' or 'localstorage'

const SEED_DATA = {
    transactions: [
        { id: "1", date: "2023-12-11", description: "Rent", category: "Housing & Rent", type: "expense", amount: 1500 },
        { id: "2", date: "2023-12-13", description: "Salary", category: "Salary & Income", type: "income", amount: 4200 },
        { id: "3", date: "2023-12-14", description: "Spotify", category: "Subscriptions", type: "expense", amount: 11.99 },
        { id: "mxwfGVy73ak", date: "2026-06-02", description: "spotify", category: "Subscriptions", type: "expense", amount: 23 },
        { id: "46GcyNTC3AU", date: "2026-06-01", description: "mcdo", category: "Food & Dining", type: "expense", amount: 160 },
        { id: "74jYoKr1LYQ", date: "2026-06-01", description: "income", category: "Salary & Income", type: "income", amount: 1000 },
        { id: "C4WiuDRRgo0", date: "2026-06-01", description: "jeep", category: "Transportation", type: "expense", amount: 20 },
        { id: "2nJQmS357KQ", date: "2026-06-01", description: "income", category: "Salary & Income", type: "income", amount: 5000 },
        { id: "NkapqKzo0kw", date: "2026-06-01", description: "keyboard", category: "Shopping & Wants", type: "expense", amount: 5000 },
        { id: "77pPMXJWLCA", date: "2026-06-01", description: "MOVIE", category: "Entertainment", type: "expense", amount: 290 },
        { id: "MsJC6mqqWxs", date: "2026-06-01", description: "BONUS", category: "Salary & Income", type: "income", amount: 10000 },
        { id: "-EG5TCVjF-Y", date: "2026-06-01", description: "Premium Coffee Beans", category: "Shopping & Wants", type: "expense", amount: 1500 }
    ],
    bills: [
        { id: "bill-1", title: "Apartment Rent", description: "Monthly rent for apartment unit.", priority: "high", status: "pending", dueDate: "2026-06-05", amount: 4500, recurring: "monthly", recurrenceProcessed: true },
        { id: "bill-2", title: "Internet Connection", description: "Fiber internet broadband monthly subscription.", priority: "medium", status: "in-progress", dueDate: "2026-06-10", amount: 49.99, recurring: "monthly" },
        { id: "bill-3", title: "Gym Membership", description: "Monthly health club/gym access fee.", priority: "low", status: "done", dueDate: "2026-06-12", amount: 29.99, recurring: "monthly" }
    ],
    wants: [
        { id: "want-1", title: "Mechanical Keyboard", amount: 3000, priority: "medium", status: "wanted" },
        { id: "want-2", title: "Wireless Earbuds", amount: 3700, priority: "low", status: "wanted" },
        { id: "want-3", title: "Premium Coffee Beans", amount: 1500, priority: "high", status: "bought" }
    ]
};

function initLocalStorageData() {
    if (!localStorage.getItem('nothing_budget_transactions')) {
        localStorage.setItem('nothing_budget_transactions', JSON.stringify(SEED_DATA.transactions));
    }
    if (!localStorage.getItem('nothing_budget_bills')) {
        localStorage.setItem('nothing_budget_bills', JSON.stringify(SEED_DATA.bills));
    }
    if (!localStorage.getItem('nothing_budget_wants')) {
        localStorage.setItem('nothing_budget_wants', JSON.stringify(SEED_DATA.wants));
    }
}

function updateDatabaseStatusUI() {
    const dot = document.getElementById('db-status-dot');
    const text = document.getElementById('db-status-text');
    const toggleBtn = document.getElementById('btn-db-toggle');
    
    if (!dot || !text || !toggleBtn) return;
    
    if (dbMode === 'json-server') {
        dot.style.backgroundColor = '#10b981'; // Green
        text.innerText = 'Server Mode';
        text.style.color = '#10b981';
        toggleBtn.innerText = 'Use LocalStorage';
    } else {
        dot.style.backgroundColor = '#6366f1'; // Indigo/Blue
        text.innerText = 'LocalStorage (Demo)';
        text.style.color = '#6366f1';
        toggleBtn.innerText = 'Connect to Server';
    }
}

async function toggleDatabaseMode() {
    const toggleBtn = document.getElementById('btn-db-toggle');
    if (!toggleBtn) return;
    
    if (dbMode === 'json-server') {
        dbMode = 'localstorage';
        initLocalStorageData();
        updateDatabaseStatusUI();
        await reloadAllData();
    } else {
        toggleBtn.innerText = 'Connecting...';
        toggleBtn.disabled = true;
        
        try {
            const res = await originalFetch('http://localhost:3000/transactions?_limit=1');
            if (res.ok) {
                dbMode = 'json-server';
                updateDatabaseStatusUI();
                await reloadAllData();
            } else {
                throw new Error('Server returned error status');
            }
        } catch (err) {
            alert('Could not connect to JSON-Server. Make sure it is running via "json-server --watch db.json --port 3000"!');
            dbMode = 'localstorage';
            updateDatabaseStatusUI();
        } finally {
            toggleBtn.disabled = false;
        }
    }
}

async function reloadAllData() {
    await Promise.all([
        loadTransactions(),
        loadBills(),
        loadWants()
    ]);
}

async function detectDatabaseMode() {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1500); // 1.5s timeout
        
        const res = await originalFetch('http://localhost:3000/transactions?_limit=1', { signal: controller.signal });
        clearTimeout(timeoutId);
        
        if (res.ok) {
            dbMode = 'json-server';
        } else {
            dbMode = 'localstorage';
        }
    } catch (err) {
        dbMode = 'localstorage';
    }
    initLocalStorageData();
    updateDatabaseStatusUI();
}

// Fetch Interception
const originalFetch = window.fetch;
async function customFetch(url, options = {}) {
    const urlStr = typeof url === 'string' ? url : (url instanceof URL ? url.href : '');
    
    if (!urlStr.startsWith('http://localhost:3000')) {
        return originalFetch(url, options);
    }
    
    const method = (options.method || 'GET').toUpperCase();
    
    if (dbMode === 'json-server') {
        try {
            return await originalFetch(url, options);
        } catch (err) {
            console.warn("JSON-Server not reachable. Switching to LocalStorage mode.", err);
            dbMode = 'localstorage';
            initLocalStorageData();
            updateDatabaseStatusUI();
        }
    }
    
    // LocalStorage fallback
    initLocalStorageData();
    updateDatabaseStatusUI();
    
    const urlPath = urlStr.replace('http://localhost:3000/', '');
    const pathParts = urlPath.split('?')[0].split('/'); // Ignore query string
    const resource = pathParts[0]; // "transactions", "bills", or "wants"
    const id = pathParts[1]; // undefined or the ID string
    
    const storageKey = `nothing_budget_${resource}`;
    let data = JSON.parse(localStorage.getItem(storageKey)) || [];
    
    let responseData = null;
    let status = 200;
    
    if (method === 'GET') {
        if (id) {
            const item = data.find(i => String(i.id) === String(id));
            if (item) {
                responseData = item;
            } else {
                status = 404;
                responseData = { error: 'Not found' };
            }
        } else {
            responseData = data;
        }
    } else if (method === 'POST') {
        const body = JSON.parse(options.body);
        data.push(body);
        localStorage.setItem(storageKey, JSON.stringify(data));
        responseData = body;
        status = 201;
    } else if (method === 'PUT') {
        const body = JSON.parse(options.body);
        const index = data.findIndex(i => String(i.id) === String(id));
        if (index !== -1) {
            data[index] = { ...data[index], ...body };
            localStorage.setItem(storageKey, JSON.stringify(data));
            responseData = data[index];
        } else {
            status = 404;
            responseData = { error: 'Not found' };
        }
    } else if (method === 'DELETE') {
        const index = data.findIndex(i => String(i.id) === String(id));
        if (index !== -1) {
            const deletedItem = data.splice(index, 1)[0];
            localStorage.setItem(storageKey, JSON.stringify(data));
            responseData = deletedItem;
        } else {
            status = 404;
            responseData = { error: 'Not found' };
        }
    }
    
    return {
        ok: status >= 200 && status < 300,
        status: status,
        json: async () => responseData,
        text: async () => JSON.stringify(responseData)
    };
}
window.fetch = customFetch;

const API = 'http://localhost:3000/transactions';
const BILLS_API = 'http://localhost:3000/bills';
const WANTS_API = 'http://localhost:3000/wants';
const form = document.getElementById('transaction-form');
const list = document.getElementById('transaction-list');

// State Variables
let transactions = [];
let editingId = null;
let bills = [];
let editingBillId = null;
let wants = [];
let editingWantId = null;
let wantsAllocationPct = parseFloat(localStorage.getItem('nothing_budget_wants_pct')) || 10;
let currentView = 'dashboard'; // dashboard, budgets, analytics, profile

const categoriesMetadata = {
    'Food & Dining': { icon: '♨', color: '#f59e0b', type: 'expense' },
    'Housing & Rent': { icon: '⌂', color: '#78350f', type: 'expense' },
    'Utilities & Bills': { icon: '⌁', color: '#3b82f6', type: 'expense' },
    'Transportation': { icon: '⛍', color: '#6366f1', type: 'expense' },
    'Shopping & Wants': { icon: '◈', color: '#ec4899', type: 'expense' },
    'Entertainment': { icon: '♫', color: '#ef4444', type: 'expense' },
    'Subscriptions': { icon: '↻', color: '#14b8a6', type: 'expense' },
    'Healthcare & Gym': { icon: '✙', color: '#10b981', type: 'expense' },
    'Salary & Income': { icon: '⛁', color: '#22c55e', type: 'income' },
    'Savings & Investments': { icon: '↗', color: '#84cc16', type: 'income' }
};

const defaultBudgetLimits = {
    'Food & Dining': 10000,
    'Housing & Rent': 25000,
    'Utilities & Bills': 8000,
    'Transportation': 5000,
    'Shopping & Wants': 6000,
    'Entertainment': 4000,
    'Subscriptions': 2000,
    'Healthcare & Gym': 3000
};
let budgetLimits = JSON.parse(localStorage.getItem('nothing_budget_limits')) || defaultBudgetLimits;

// Current filtering month (YYYY-MM format)
let currentMonth = '';

// Filter & Sort State
let filterSearch = '';
let filterCategory = 'All';
let filterType = 'All';
let sortKey = 'date';
let sortOrder = 'desc';

// Helper: Filter transactions for the active month
function getFilteredTransactions() {
    let filtered = transactions;

    if (currentMonth) {
        filtered = filtered.filter(t => t.date && t.date.substring(0, 7) === currentMonth);
    }

    if (filterSearch.trim() !== '') {
        const query = filterSearch.toLowerCase().trim();
        filtered = filtered.filter(t => t.description && t.description.toLowerCase().includes(query));
    }

    if (filterCategory !== 'All') {
        filtered = filtered.filter(t => t.category === filterCategory);
    }

    if (filterType !== 'All') {
        filtered = filtered.filter(t => t.type === filterType);
    }

    return filtered;
}

// Helper: Update page title month-year string and month filter input field value
function updateHeader() {
    if (!currentMonth) return;
    const [year, month] = currentMonth.split('-');
    const dateObj = new Date(year, parseInt(month) - 1, 1);
    const monthName = dateObj.toLocaleString('en-US', { month: 'long' }).toUpperCase();

    const displayEl = document.getElementById('current-month-display');
    if (displayEl) {
        displayEl.innerText = `${monthName} ${year}`;
    }

    const filterInput = document.getElementById('month-filter');
    if (filterInput && filterInput.value !== currentMonth) {
        filterInput.value = currentMonth;
    }
}

// Helper: Update budget utilization progress list
function updateBudgetUtilization() {
    const listContainer = document.getElementById('budget-utilization-list');
    if (!listContainer) return;

    listContainer.innerHTML = '';
    const filtered = getFilteredTransactions();

    const categoryExpenses = {};
    Object.keys(categoriesMetadata).forEach(cat => {
        if (categoriesMetadata[cat].type === 'expense') {
            categoryExpenses[cat] = 0;
        }
    });

    filtered.forEach(t => {
        if (t.type === 'expense' && categoryExpenses.hasOwnProperty(t.category)) {
            categoryExpenses[t.category] += parseFloat(t.amount);
        }
    });

    Object.keys(categoryExpenses).forEach(cat => {
        const spent = categoryExpenses[cat];
        const limit = budgetLimits[cat] || 0;
        const pct = limit > 0 ? Math.round((spent / limit) * 100) : 0;
        const barWidth = Math.min(pct, 100);

        const isOver = spent > limit;
        const catMeta = categoriesMetadata[cat] || { icon: '❓', color: '#888888' };
        const barColor = catMeta.color;

        const li = document.createElement('li');
        li.className = 'util-item';
        li.innerHTML = `
            <span class="util-name" title="${cat}">${catMeta.icon} ${cat}</span>
            <div class="util-bar-bg">
                <div class="util-bar-fill" style="width: ${barWidth}%; background-color: ${barColor}; transition: width 0.3s ease;"></div>
            </div>
            <span class="util-pct ${isOver ? 'text-red' : ''}">${pct}%</span>
        `;
        listContainer.appendChild(li);
    });
}

// --- Dashboard Logic ---
function updateDashboard() {
    let lifetimeIncome = 0;
    let lifetimeExpenses = 0;
    transactions.forEach(t => {
        if (t.type === 'income') {
            lifetimeIncome += parseFloat(t.amount) || 0;
        } else if (t.type === 'expense') {
            lifetimeExpenses += parseFloat(t.amount) || 0;
        }
    });
    const totalBalance = lifetimeIncome - lifetimeExpenses;

    let totalIncome = 0;
    let totalExpenses = 0;
    const filtered = getFilteredTransactions();

    filtered.forEach(t => {
        if (t.type === 'income') {
            totalIncome += parseFloat(t.amount) || 0;
        } else if (t.type === 'expense') {
            totalExpenses += parseFloat(t.amount) || 0;
        }
    });

    const formatCurrency = (num) => '₱' + num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    document.getElementById('display-balance').innerText = formatCurrency(totalBalance);
    document.getElementById('display-expenses').innerText = formatCurrency(totalExpenses);

    const assumedIncomeGoal = totalIncome > 0 ? totalIncome : 5000;
    const expensePercent = Math.min((totalExpenses / assumedIncomeGoal) * 100, 100);

    document.getElementById('display-percent').innerText = `${Math.round(expensePercent)}%`;
    document.getElementById('display-bar').style.width = `${expensePercent}%`;

    // Render dynamic budget utilization bars
    updateBudgetUtilization();
}

function drawSparkline() {
    const canvas = document.getElementById('balanceChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Sort all transactions chronologically to calculate running balance
    const chronTransactions = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));

    // Calculate running balance history for the active month
    let balance = 0;

    // Find initial starting balance before the active month
    chronTransactions.forEach(t => {
        if (t.date && t.date.substring(0, 7) < currentMonth) {
            if (t.type === 'income') balance += parseFloat(t.amount);
            else balance -= parseFloat(t.amount);
        }
    });

    const balanceHistory = [balance];

    chronTransactions.forEach(t => {
        if (t.date && t.date.substring(0, 7) === currentMonth) {
            if (t.type === 'income') {
                balance += parseFloat(t.amount);
            } else if (t.type === 'expense') {
                balance -= parseFloat(t.amount);
            }
            balanceHistory.push(balance);
        }
    });

    // If no transactions in the active month, push starting balance again to draw a flat line
    if (balanceHistory.length === 1) {
        balanceHistory.push(balance);
    }

    const data = balanceHistory;
    const width = canvas.width;
    const height = canvas.height;
    const maxData = Math.max(...data);
    const minData = Math.min(...data);
    const range = maxData - minData;
    const stepX = width / (data.length - 1);

    ctx.clearRect(0, 0, width, height);

    ctx.beginPath();
    ctx.moveTo(0, height);
    data.forEach((val, i) => {
        const x = i * stepX;
        const y = range === 0 ? height / 2 : height - ((val - minData) / range * (height - 6) + 3);
        ctx.lineTo(x, y);
    });
    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fill();

    ctx.beginPath();
    data.forEach((val, i) => {
        const x = i * stepX;
        const y = range === 0 ? height / 2 : height - ((val - minData) / range * (height - 6) + 3);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#222222';
    ctx.lineWidth = 1.5;
    ctx.stroke();
}

// --- CRUD Operations ---
async function loadTransactions() {
    try {
        const res = await fetch(API);
        if (!res.ok) throw new Error('Failed to load');
        transactions = await res.json();

        // Initialize currentMonth if empty
        if (!currentMonth) {
            if (transactions.length > 0) {
                const sorted = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
                currentMonth = sorted[0].date.substring(0, 7);
            } else {
                const today = new Date();
                currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
            }
        }

        updateHeader();
        switchView(currentView);
        renderTransactions();
        updateDashboard();
    } catch (err) {
        console.error(err);
        alert('Make sure json-server is running! Error: ' + err.message);
    }
}

async function addTransaction(transaction) {
    try {
        const res = await fetch(API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(transaction)
        });
        if (!res.ok) throw new Error('Create failed');
        await loadTransactions();
    } catch (err) {
        alert(err.message);
    }
}

async function deleteTransaction(id) {
    try {
        const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Delete failed');
        await loadTransactions();
    } catch (err) {
        alert(err.message);
    }
}

async function updateTransaction(id, updatedRecord) {
    try {
        const res = await fetch(`${API}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedRecord)
        });
        if (!res.ok) throw new Error('Update failed');
        await loadTransactions();
    } catch (err) {
        alert(err.message);
    }
}

// --- Helper Functions for Editing ---
function startEditTransaction(t) {
    editingId = t.id;
    form.date.value = t.date;
    form.description.value = t.description;
    form.category.value = t.category;
    form.amount.value = t.amount;

    document.getElementById('submit-btn').innerText = 'Update';
    document.getElementById('cancel-edit-btn').style.display = 'block';
    form.scrollIntoView({ behavior: 'smooth' });
}

function resetTransactionForm() {
    form.reset();
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const dateInput = document.getElementById('date');
    if (dateInput) {
        dateInput.value = `${yyyy}-${mm}-${dd}`;
    }
}

function cancelEditTransaction() {
    editingId = null;
    resetTransactionForm();
    document.getElementById('submit-btn').innerText = 'Add';
    document.getElementById('cancel-edit-btn').style.display = 'none';
}

// --- Render Table & Sorting ---
function renderTransactions() {
    list.innerHTML = '';

    const keyInput = document.getElementById('sort-key');
    const orderInput = document.getElementById('sort-order');
    const key = keyInput ? keyInput.value : sortKey;
    const order = orderInput ? orderInput.value : sortOrder;

    const filtered = getFilteredTransactions();

    filtered.sort((a, b) => {
        let comparison = 0;
        if (key === 'date') {
            comparison = new Date(a.date) - new Date(b.date);
            if (comparison === 0) {
                const aId = isNaN(a.id) ? 0 : parseFloat(a.id);
                const bId = isNaN(b.id) ? 0 : parseFloat(b.id);
                comparison = aId - bId;
            }
        } else if (key === 'description') {
            comparison = a.description.toLowerCase().localeCompare(b.description.toLowerCase());
        } else if (key === 'category') {
            comparison = a.category.localeCompare(b.category);
        } else if (key === 'amount') {
            comparison = parseFloat(a.amount) - parseFloat(b.amount);
        }
        
        if (comparison === 0 && key !== 'date') {
            comparison = new Date(a.date) - new Date(b.date);
            if (comparison === 0) {
                const aId = isNaN(a.id) ? 0 : parseFloat(a.id);
                const bId = isNaN(b.id) ? 0 : parseFloat(b.id);
                comparison = aId - bId;
            }
        }
        
        return order === 'asc' ? comparison : -comparison;
    });

    filtered.forEach(t => {
        const tr = document.createElement('tr');

        const amountClass = t.type === 'income' ? 'amount-pos' : 'amount-neg';
        const amountSign = t.type === 'income' ? '+' : '-';
        const formattedAmount = `₱${parseFloat(t.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

        const catMeta = categoriesMetadata[t.category] || { icon: '◇', color: '#888888' };
        const categoryBadgeHtml = `
            <span class="category-badge">
                <span class="category-badge-dot" style="background-color: ${catMeta.color};"></span>
                <span>${catMeta.icon} ${t.category}</span>
            </span>
        `;

        tr.innerHTML = `
            <td>${t.date}</td>
            <td>${t.description}</td>
            <td>${categoryBadgeHtml}</td>
            <td class="${amountClass}">${amountSign}${formattedAmount}</td>
            <td class="actions-col">
                <div class="action-btns">
                    <button class="btn-action edit-btn">Edit</button>
                    <button class="btn-action del-btn">Del</button>
                </div>
            </td>
        `;

        tr.querySelector('.del-btn').addEventListener('click', () => {
            if (confirm('Delete this transaction?')) deleteTransaction(t.id);
        });

        tr.querySelector('.edit-btn').addEventListener('click', () => {
            startEditTransaction(t);
        });

        list.append(tr);
    });
}

// --- Event Listeners ---
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const category = form.category.value;
    const type = categoriesMetadata[category] ? categoriesMetadata[category].type : 'expense';

    const transactionData = {
        date: form.date.value,
        description: form.description.value.trim(),
        category: category,
        type: type,
        amount: parseFloat(form.amount.value)
    };

    if (isNaN(transactionData.amount)) {
        alert('Please fill out the form correctly.');
        return;
    }

    if (editingId) {
        const updatedRecord = { id: editingId, ...transactionData };
        updateTransaction(editingId, updatedRecord);
        cancelEditTransaction();
    } else {
        const newTransaction = {
            id: String(Date.now()),
            ...transactionData
        };
        addTransaction(newTransaction);
        resetTransactionForm();
    }
});

document.getElementById('cancel-edit-btn').addEventListener('click', cancelEditTransaction);

function initFilterListeners() {
    const searchInput = document.getElementById('filter-search');
    const categorySelect = document.getElementById('filter-category');
    const typeSelect = document.getElementById('filter-type');
    const sortKeySelect = document.getElementById('sort-key');
    const sortOrderSelect = document.getElementById('sort-order');
    const clearBtn = document.getElementById('btn-clear-filters');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            filterSearch = e.target.value;
            renderTransactions();
            updateDashboard();
            drawSparkline();
        });
    }

    if (categorySelect) {
        categorySelect.addEventListener('change', (e) => {
            filterCategory = e.target.value;
            renderTransactions();
            updateDashboard();
            drawSparkline();
        });
    }

    if (typeSelect) {
        typeSelect.addEventListener('change', (e) => {
            filterType = e.target.value;
            renderTransactions();
            updateDashboard();
            drawSparkline();
        });
    }

    if (sortKeySelect) {
        sortKeySelect.addEventListener('change', (e) => {
            sortKey = e.target.value;
            renderTransactions();
        });
    }

    if (sortOrderSelect) {
        sortOrderSelect.addEventListener('change', (e) => {
            sortOrder = e.target.value;
            renderTransactions();
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            filterSearch = '';
            filterCategory = 'All';
            filterType = 'All';
            sortKey = 'date';
            sortOrder = 'desc';

            if (searchInput) searchInput.value = '';
            if (categorySelect) categorySelect.value = 'All';
            if (typeSelect) typeSelect.value = 'All';
            if (sortKeySelect) sortKeySelect.value = 'date';
            if (sortOrderSelect) sortOrderSelect.value = 'desc';

            renderTransactions();
            updateDashboard();
            drawSparkline();
        });
    }
}

function populateCategoryDropdowns() {
    const filterSelect = document.getElementById('filter-category');
    const transactionSelect = document.getElementById('category');
    const budgetSelect = document.getElementById('budget-category');

    if (filterSelect) {
        filterSelect.innerHTML = '<option value="All">All Categories</option>';
        Object.keys(categoriesMetadata).forEach(cat => {
            const meta = categoriesMetadata[cat];
            const opt = document.createElement('option');
            opt.value = cat;
            opt.innerText = `${meta.icon} ${cat}`;
            filterSelect.appendChild(opt);
        });
    }

    if (transactionSelect) {
        transactionSelect.innerHTML = '';
        Object.keys(categoriesMetadata).forEach(cat => {
            const meta = categoriesMetadata[cat];
            const opt = document.createElement('option');
            opt.value = cat;
            opt.innerText = `${meta.icon} ${cat}`;
            transactionSelect.appendChild(opt);
        });
    }

    if (budgetSelect) {
        budgetSelect.innerHTML = '';
        Object.keys(categoriesMetadata).forEach(cat => {
            const meta = categoriesMetadata[cat];
            if (meta.type === 'expense') {
                const opt = document.createElement('option');
                opt.value = cat;
                opt.innerText = `${meta.icon} ${cat}`;
                budgetSelect.appendChild(opt);
            }
        });
    }
}

// --- Budgets Tab Logic ---
function renderBudgetsView() {
    const tableBody = document.getElementById('budget-limits-table-body');
    if (!tableBody) return;

    tableBody.innerHTML = '';
    const filtered = getFilteredTransactions();

    const categoryExpenses = {};
    Object.keys(categoriesMetadata).forEach(cat => {
        if (categoriesMetadata[cat].type === 'expense') {
            categoryExpenses[cat] = 0;
        }
    });

    filtered.forEach(t => {
        if (t.type === 'expense' && categoryExpenses.hasOwnProperty(t.category)) {
            categoryExpenses[t.category] += parseFloat(t.amount);
        }
    });

    Object.keys(budgetLimits).forEach(cat => {
        if (!categoriesMetadata[cat]) return;
        const limit = budgetLimits[cat];
        const spent = categoryExpenses[cat] || 0;
        const remaining = limit - spent;
        const isOver = remaining < 0;

        const pct = limit > 0 ? Math.round((spent / limit) * 100) : 0;
        const barWidth = Math.min(pct, 100);

        const catMeta = categoriesMetadata[cat] || { icon: '❓', color: '#888888' };
        const barColor = isOver ? 'var(--accent-red)' : catMeta.color;

        const categoryBadgeHtml = `
            <span class="category-badge">
                <span class="category-badge-dot" style="background-color: ${catMeta.color};"></span>
                <span>${catMeta.icon} ${cat}</span>
            </span>
        `;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${categoryBadgeHtml}</td>
            <td>₱${limit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            <td class="${spent > 0 ? 'amount-neg' : ''}">₱${spent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            <td class="${isOver ? 'text-red' : 'text-green'}" style="font-weight: 600;">
                ${isOver ? '-' : ''}₱${Math.abs(remaining).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                ${isOver ? ' (Overspent)' : ''}
            </td>
            <td style="min-width: 160px; vertical-align: middle;">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="flex: 1; height: 6px; background-color: #e0e0e0; border-radius: 3px; overflow: hidden; position: relative;">
                        <div style="height: 100%; width: ${barWidth}%; background-color: ${barColor}; transition: width 0.3s ease;"></div>
                    </div>
                    <span style="font-size: 11px; font-weight: 600; min-width: 35px; text-align: right;" class="${isOver ? 'text-red' : ''}">${pct}%</span>
                </div>
            </td>
        `;
        tableBody.appendChild(tr);
    });
}

function initBudgetsForm() {
    const budgetForm = document.getElementById('budget-limit-form');
    if (!budgetForm) return;

    budgetForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const category = document.getElementById('budget-category').value;
        const amount = parseFloat(document.getElementById('budget-amount').value);

        if (!category || isNaN(amount) || amount < 0) {
            alert('Please enter a valid amount.');
            return;
        }

        budgetLimits[category] = amount;
        localStorage.setItem('nothing_budget_limits', JSON.stringify(budgetLimits));

        renderBudgetsView();
        updateBudgetUtilization();
        updateDashboard();

        budgetForm.reset();
    });
}

// --- Analytics Tab Logic ---
function renderAnalyticsView() {
    const tableBody = document.getElementById('analytics-summary-table-body');
    if (!tableBody) return;

    tableBody.innerHTML = '';
    const filtered = getFilteredTransactions().filter(t => t.type === 'expense');

    const summary = {};
    Object.keys(categoriesMetadata).forEach(cat => {
        if (categoriesMetadata[cat].type === 'expense') {
            summary[cat] = { count: 0, total: 0 };
        }
    });

    let overallExpense = 0;

    filtered.forEach(t => {
        if (summary.hasOwnProperty(t.category)) {
            summary[t.category].count++;
            summary[t.category].total += parseFloat(t.amount);
            overallExpense += parseFloat(t.amount);
        }
    });

    Object.keys(summary).forEach(cat => {
        const item = summary[cat];
        const pct = overallExpense > 0 ? ((item.total / overallExpense) * 100).toFixed(1) : '0.0';
        const avg = item.count > 0 ? (item.total / item.count).toFixed(2) : '0.00';

        const catMeta = categoriesMetadata[cat] || { icon: '❓', color: '#888888' };
        const categoryBadgeHtml = `
            <span class="category-badge">
                <span class="category-badge-dot" style="background-color: ${catMeta.color};"></span>
                <span>${catMeta.icon} ${cat}</span>
            </span>
        `;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${categoryBadgeHtml}</td>
            <td>${item.count}</td>
            <td>₱${item.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            <td>${pct}%</td>
            <td>₱${parseFloat(avg).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        `;
        tableBody.appendChild(tr);
    });

    drawIncomeExpenseChart();
    drawCategoryChart(summary, overallExpense);
}

function drawIncomeExpenseChart() {
    const canvas = document.getElementById('analyticsIncomeExpenseChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    let income = 0;
    let expenses = 0;

    getFilteredTransactions().forEach(t => {
        if (t.type === 'income') income += parseFloat(t.amount);
        else if (t.type === 'expense') expenses += parseFloat(t.amount);
    });

    ctx.clearRect(0, 0, width, height);

    const maxVal = Math.max(income, expenses, 100);
    const margin = 40;
    const chartHeight = height - margin * 2;
    const barWidth = 60;

    const incomeBarHeight = (income / maxVal) * chartHeight;
    const expenseBarHeight = (expenses / maxVal) * chartHeight;

    ctx.strokeStyle = '#eeeeee';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
        const y = margin + (chartHeight / 4) * i;
        ctx.beginPath();
        ctx.moveTo(margin, y);
        ctx.lineTo(width - margin, y);
        ctx.stroke();
    }

    const x1 = width / 2 - barWidth - 20;
    const y1 = height - margin - incomeBarHeight;
    ctx.fillStyle = '#3e7a4b';
    ctx.fillRect(x1, y1, barWidth, incomeBarHeight);
    ctx.strokeStyle = 'var(--text-main)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x1, y1, barWidth, incomeBarHeight);

    const x2 = width / 2 + 20;
    const y2 = height - margin - expenseBarHeight;
    ctx.fillStyle = '#a33e3e';
    ctx.fillRect(x2, y2, barWidth, expenseBarHeight);
    ctx.strokeRect(x2, y2, barWidth, expenseBarHeight);

    ctx.fillStyle = 'var(--text-main)';
    ctx.font = 'bold 11px Inter';
    ctx.textAlign = 'center';

    ctx.fillText('INCOME', x1 + barWidth / 2, height - margin + 18);
    ctx.fillText('EXPENSES', x2 + barWidth / 2, height - margin + 18);

    ctx.font = '10px Inter';
    ctx.fillText(`₱${income.toFixed(2)}`, x1 + barWidth / 2, y1 - 8);
    ctx.fillText(`₱${expenses.toFixed(2)}`, x2 + barWidth / 2, y2 - 8);
}

function drawCategoryChart(summary, overallExpense) {
    const canvas = document.getElementById('analyticsCategoryChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const categories = Object.keys(summary);

    const centerX = 110;
    const centerY = height / 2;
    const radius = 65;

    let startAngle = -Math.PI / 2;

    if (overallExpense === 0) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = '#cccccc';
        ctx.lineWidth = 15;
        ctx.stroke();

        ctx.fillStyle = '#999999';
        ctx.font = '11px Inter';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('NO DATA', centerX, centerY);
        return;
    }

    categories.forEach((cat) => {
        const amt = summary[cat].total;
        if (amt === 0) return;

        const sliceAngle = (amt / overallExpense) * 2 * Math.PI;
        const endAngle = startAngle + sliceAngle;

        const catMeta = categoriesMetadata[cat] || { color: '#888888' };
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.strokeStyle = catMeta.color;
        ctx.lineWidth = 18;
        ctx.stroke();

        startAngle = endAngle;
    });

    ctx.fillStyle = 'var(--text-main)';
    ctx.font = 'bold 11px Inter';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('TOTAL', centerX, centerY - 8);
    ctx.font = '10px Inter';
    ctx.fillText(`₱${overallExpense.toFixed(0)}`, centerX, centerY + 8);

    const legendX = 220;
    let legendY = centerY - (categories.length * 20) / 2 + 10;

    categories.forEach((cat) => {
        const amt = summary[cat].total;
        const pct = overallExpense > 0 ? Math.round((amt / overallExpense) * 100) : 0;

        const catMeta = categoriesMetadata[cat] || { color: '#888888' };
        ctx.fillStyle = catMeta.color;
        ctx.fillRect(legendX, legendY - 8, 10, 10);
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.strokeRect(legendX, legendY - 8, 10, 10);

        ctx.fillStyle = 'var(--text-main)';
        ctx.font = '10px Inter';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${cat} (${pct}%)`, legendX + 18, legendY - 2);

        legendY += 20;
    });
}
// --- Profile Tab Logic ---
function renderProfileView() {
    let totalIncome = 0;
    let totalExpenses = 0;

    transactions.forEach(t => {
        if (t.type === 'income') totalIncome += parseFloat(t.amount);
        else if (t.type === 'expense') totalExpenses += parseFloat(t.amount);
    });

    const totalSavings = totalIncome - totalExpenses;

    document.getElementById('stat-total-count').innerText = transactions.length;
    document.getElementById('stat-total-income').innerText = `₱${totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    document.getElementById('stat-total-expenses').innerText = `₱${totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const savingsEl = document.getElementById('stat-total-savings');
    savingsEl.innerText = `${totalSavings < 0 ? '-' : ''}₱${Math.abs(totalSavings).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (totalSavings < 0) {
        savingsEl.className = 'stat-value text-red';
    } else {
        savingsEl.className = 'stat-value text-green';
    }
}

function initProfileControls() {
    const btnExport = document.getElementById('btn-export-csv');
    const btnResetBudgets = document.getElementById('btn-reset-budgets');
    const btnResetDb = document.getElementById('btn-reset-db');

    if (btnExport) {
        btnExport.addEventListener('click', () => {
            if (transactions.length === 0) {
                alert('No transactions to export.');
                return;
            }

            const headers = ['ID', 'Date', 'Description', 'Category', 'Type', 'Amount'];
            const rows = transactions.map(t => [
                t.id,
                t.date,
                `"${t.description.replace(/"/g, '""')}"`,
                t.category,
                t.type,
                t.amount
            ]);

            const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', `nothing_budget_export.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }

    if (btnResetBudgets) {
        btnResetBudgets.addEventListener('click', () => {
            if (confirm('Reset budget limits to default settings?')) {
                budgetLimits = { ...defaultBudgetLimits };
                localStorage.setItem('nothing_budget_limits', JSON.stringify(budgetLimits));
                alert('Budget limits reset to default.');
                if (currentView === 'budgets') renderBudgetsView();
                updateBudgetUtilization();
                updateDashboard();
            }
        });
    }

    if (btnResetDb) {
        btnResetDb.addEventListener('click', async () => {
            if (transactions.length === 0) {
                alert('Database is already empty.');
                return;
            }
            if (confirm('WARNING: Are you sure you want to permanently delete ALL transactions? This cannot be undone.')) {
                try {
                    btnResetDb.innerText = 'Clearing...';
                    btnResetDb.disabled = true;

                    const deletePromises = transactions.map(t =>
                        fetch(`${API}/${t.id}`, { method: 'DELETE' })
                    );
                    await Promise.all(deletePromises);
                    await loadTransactions();
                    alert('All transactions cleared.');
                } catch (err) {
                    alert('Failed to clear database: ' + err.message);
                } finally {
                    btnResetDb.innerText = 'Clear All Transactions';
                    btnResetDb.disabled = false;
                }
            }
        });
    }
}

// --- Bills Management Logic ---
async function loadBills() {
    try {
        const res = await fetch(BILLS_API);
        if (!res.ok) throw new Error('Failed to load bills');
        bills = await res.json();
        if (currentView === 'bills') {
            renderBillsView();
        }
    } catch (err) {
        console.error(err);
        alert('Make sure json-server is running! Error: ' + err.message);
    }
}

async function addBill(bill) {
    try {
        const res = await fetch(BILLS_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bill)
        });
        if (!res.ok) throw new Error('Create bill failed');
        await loadBills();
    } catch (err) {
        alert(err.message);
    }
}

async function deleteBill(id) {
    try {
        const res = await fetch(`${BILLS_API}/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Delete bill failed');
        await loadBills();
    } catch (err) {
        alert(err.message);
    }
}

async function updateBill(id, updatedBill) {
    try {
        const res = await fetch(`${BILLS_API}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedBill)
        });
        if (!res.ok) throw new Error('Update bill failed');
        await loadBills();
    } catch (err) {
        alert(err.message);
    }
}

async function cycleBillStatus(bill) {
    let nextStatus = 'pending';
    if (bill.status === 'pending') {
        nextStatus = 'in-progress';
    } else if (bill.status === 'in-progress') {
        nextStatus = 'done';
    }

    const updatedBill = { ...bill, status: nextStatus };

    let triggerRecurrence = false;
    if (nextStatus === 'done' && updatedBill.recurring && updatedBill.recurring !== 'none' && !updatedBill.recurrenceProcessed) {
        triggerRecurrence = true;
        updatedBill.recurrenceProcessed = true;
    }

    await updateBill(bill.id, updatedBill);

    if (nextStatus === 'done') {
        await promptAutoExpense(updatedBill);
    }

    if (triggerRecurrence) {
        await generateNextRecurringInstance(updatedBill);
    }
}

async function promptAutoExpense(bill) {
    const confirmLog = confirm(`Would you like to automatically log "${bill.title}" as an Expense transaction?`);
    if (confirmLog) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const currentDate = `${yyyy}-${mm}-${dd}`;

        const newTransaction = {
            id: String(Date.now()),
            date: currentDate,
            description: bill.title,
            category: 'Subscriptions',
            type: 'expense',
            amount: parseFloat(bill.amount) || 0
        };

        await addTransaction(newTransaction);
        alert('Expense transaction logged successfully!');
    }
}

const billForm = document.getElementById('bill-form');

function startEditBill(bill) {
    if (!billForm) return;
    editingBillId = bill.id;
    billForm.title.value = bill.title;
    billForm.description.value = bill.description || '';
    billForm.priority.value = bill.priority;
    billForm.status.value = bill.status;
    billForm.dueDate.value = bill.dueDate || '';
    billForm.amount.value = bill.amount;
    billForm.recurring.value = bill.recurring || 'none';

    document.getElementById('bill-form-title').innerText = 'EDIT BILL';
    document.getElementById('bill-submit-btn').innerText = 'Update Bill';
    document.getElementById('cancel-bill-edit-btn').style.display = 'block';
    billForm.scrollIntoView({ behavior: 'smooth' });
}

function resetBillForm() {
    if (!billForm) return;
    billForm.reset();
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const dateInput = document.getElementById('bill-due');
    if (dateInput) {
        dateInput.value = `${yyyy}-${mm}-${dd}`;
    }
    billForm.recurring.value = 'none';
}

function cancelEditBill() {
    editingBillId = null;
    resetBillForm();
    document.getElementById('bill-form-title').innerText = 'NEW BILL';
    document.getElementById('bill-submit-btn').innerText = 'Add Bill';
    document.getElementById('cancel-bill-edit-btn').style.display = 'none';
}

function getNextDueDate(dateStr, frequency) {
    if (!dateStr) return '';
    const date = new Date(dateStr + 'T00:00:00');
    if (isNaN(date.getTime())) return dateStr;

    if (frequency === 'monthly') {
        date.setMonth(date.getMonth() + 1);
    } else if (frequency === 'yearly') {
        date.setFullYear(date.getFullYear() + 1);
    }

    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

async function generateNextRecurringInstance(bill) {
    const nextDueDate = getNextDueDate(bill.dueDate, bill.recurring);
    const nextBill = {
        id: 'bill-' + Date.now(),
        title: bill.title,
        description: bill.description,
        priority: bill.priority,
        status: 'pending',
        dueDate: nextDueDate,
        amount: bill.amount,
        recurring: bill.recurring
    };

    await addBill(nextBill);
    alert(`Recurring bill "${bill.title}" has been settled. A new pending bill has been generated for the next period (${nextDueDate}).`);
}

function renderBillsView() {
    const tableBody = document.getElementById('bills-list-table-body');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    let totalOutstanding = 0;
    let totalSettled = 0;
    let pendingCount = 0;
    let settledCount = 0;
    let nextDueBill = null;

    bills.forEach(bill => {
        const isSettled = bill.status === 'done';
        const amt = parseFloat(bill.amount) || 0;

        if (isSettled) {
            settledCount++;
            totalSettled += amt;
        } else {
            pendingCount++;
            totalOutstanding += amt;

            // Find the pending/in-progress bill with the earliest due date
            if (bill.dueDate) {
                if (!nextDueBill || new Date(bill.dueDate) < new Date(nextDueBill.dueDate)) {
                    nextDueBill = bill;
                }
            }
        }

        const tr = document.createElement('tr');

        const statusClass = `status-${bill.status}`;
        const priorityClass = `priority-${bill.priority}`;

        const formattedAmount = `₱${amt.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        const recurringLabel = bill.recurring && bill.recurring !== 'none' ? `⟳ ${bill.recurring}` : 'One-time';

        tr.innerHTML = `
            <td>
                <strong>${bill.title}</strong><br>
                <span style="font-size: 10px; color: var(--text-muted);">${recurringLabel}</span>
            </td>
            <td>${bill.description || ''}</td>
            <td><span class="priority-badge ${priorityClass}">${bill.priority}</span></td>
            <td><span class="status-badge ${statusClass}" title="Click to cycle status">${bill.status === 'done' ? 'Settled' : bill.status === 'in-progress' ? 'In-Progress' : 'Pending'}</span></td>
            <td>${bill.dueDate || ''}</td>
            <td>${formattedAmount}</td>
            <td class="actions-col">
                <div class="action-btns">
                    <button class="btn-action edit-btn">Edit</button>
                    <button class="btn-action del-btn">Del</button>
                </div>
            </td>
        `;

        tr.querySelector('.del-btn').addEventListener('click', () => {
            if (confirm(`Delete the bill "${bill.title}"?`)) {
                deleteBill(bill.id);
            }
        });

        tr.querySelector('.edit-btn').addEventListener('click', () => {
            startEditBill(bill);
        });

        tr.querySelector('.status-badge').addEventListener('click', () => {
            cycleBillStatus(bill);
        });

        tableBody.appendChild(tr);
    });

    const formatCurrency = (num) => '₱' + num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const outstandingEl = document.getElementById('bills-total-outstanding');
    if (outstandingEl) outstandingEl.innerText = formatCurrency(totalOutstanding);

    const settledEl = document.getElementById('bills-total-settled');
    if (settledEl) settledEl.innerText = formatCurrency(totalSettled);

    const pendingEl = document.getElementById('bills-pending-count');
    if (pendingEl) pendingEl.innerText = pendingCount;

    const nextDueEl = document.getElementById('bills-next-due');
    if (nextDueEl) {
        if (nextDueBill) {
            const dateObj = new Date(nextDueBill.dueDate);
            const options = { month: 'short', day: 'numeric' };
            const formattedDate = isNaN(dateObj) ? nextDueBill.dueDate : dateObj.toLocaleDateString('en-US', options);
            nextDueEl.innerHTML = `${nextDueBill.title}<br><span style="font-size: 11px; color: var(--text-muted); font-weight: 500;">Due ${formattedDate} (${formatCurrency(nextDueBill.amount)})</span>`;
            nextDueEl.style.whiteSpace = 'normal';
        } else {
            nextDueEl.innerText = 'None Pending';
            nextDueEl.style.color = 'var(--text-muted)';
        }
    }

    const totalBills = bills.length;
    const settledPct = totalBills > 0 ? Math.round((settledCount / totalBills) * 100) : 0;

    const progressPctEl = document.getElementById('bills-progress-pct');
    if (progressPctEl) progressPctEl.innerText = `${settledPct}% Settled`;

    const progressBarEl = document.getElementById('bills-progress-bar');
    if (progressBarEl) progressBarEl.style.width = `${settledPct}%`;
}

function initBillsForm() {
    if (!billForm) return;

    billForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const billData = {
            title: billForm.title.value.trim(),
            description: billForm.description.value.trim(),
            priority: billForm.priority.value,
            status: billForm.status.value,
            dueDate: billForm.dueDate.value,
            amount: parseFloat(billForm.amount.value),
            recurring: billForm.recurring.value
        };

        if (!billData.title || isNaN(billData.amount)) {
            alert('Please fill out the form correctly.');
            return;
        }

        if (editingBillId) {
            const updatedBill = { id: editingBillId, ...billData };

            let triggerRecurrence = false;
            const prevBill = bills.find(b => b.id === editingBillId);
            const wasDone = prevBill ? prevBill.status === 'done' : false;
            const isDone = billData.status === 'done';

            if (isDone && !wasDone && billData.recurring && billData.recurring !== 'none' && !prevBill?.recurrenceProcessed) {
                triggerRecurrence = true;
                updatedBill.recurrenceProcessed = true;
            } else if (prevBill) {
                updatedBill.recurrenceProcessed = prevBill.recurrenceProcessed;
            }

            await updateBill(editingBillId, updatedBill);
            if (isDone) {
                await promptAutoExpense(updatedBill);
            }
            if (triggerRecurrence) {
                await generateNextRecurringInstance(updatedBill);
            }
            cancelEditBill();
        } else {
            const newBill = {
                id: 'bill-' + Date.now(),
                ...billData
            };

            let triggerRecurrence = false;
            if (newBill.status === 'done' && newBill.recurring && newBill.recurring !== 'none') {
                triggerRecurrence = true;
                newBill.recurrenceProcessed = true;
            }

            await addBill(newBill);
            if (newBill.status === 'done') {
                await promptAutoExpense(newBill);
            }
            if (triggerRecurrence) {
                await generateNextRecurringInstance(newBill);
            }
            resetBillForm();
        }
    });

    const cancelBtn = document.getElementById('cancel-bill-edit-btn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', cancelEditBill);
    }
}

// --- Wants Allocation Logic ---
async function loadWants() {
    try {
        const res = await fetch(WANTS_API);
        if (!res.ok) throw new Error('Failed to load wants');
        wants = await res.json();
        if (currentView === 'wants') {
            renderWantsView();
        }
    } catch (err) {
        console.error(err);
        alert('Make sure json-server is running! Error: ' + err.message);
    }
}

async function addWant(want) {
    try {
        const res = await fetch(WANTS_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(want)
        });
        if (!res.ok) throw new Error('Create want failed');
        await loadWants();
    } catch (err) {
        alert(err.message);
    }
}

async function deleteWant(id) {
    try {
        const res = await fetch(`${WANTS_API}/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Delete want failed');
        await loadWants();
    } catch (err) {
        alert(err.message);
    }
}

async function updateWant(id, updatedWant) {
    try {
        const res = await fetch(`${WANTS_API}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedWant)
        });
        if (!res.ok) throw new Error('Update want failed');
        await loadWants();
    } catch (err) {
        alert(err.message);
    }
}

async function cycleWantStatus(want) {
    const nextStatus = want.status === 'wanted' ? 'bought' : 'wanted';
    const updatedWant = { ...want, status: nextStatus };
    await updateWant(want.id, updatedWant);

    if (nextStatus === 'bought') {
        await promptAutoExpenseWant(updatedWant);
    }
}

async function promptAutoExpenseWant(want) {
    const confirmLog = confirm(`Would you like to automatically log "${want.title}" as an Expense transaction?`);
    if (confirmLog) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const currentDate = `${yyyy}-${mm}-${dd}`;

        const newTransaction = {
            id: String(Date.now()),
            date: currentDate,
            description: want.title,
            category: 'Shopping & Wants',
            type: 'expense',
            amount: parseFloat(want.amount) || 0
        };

        await addTransaction(newTransaction);
        alert('Expense transaction logged successfully!');
    }
}

const wantForm = document.getElementById('want-form');

function startEditWant(want) {
    if (!wantForm) return;
    editingWantId = want.id;
    wantForm.title.value = want.title;
    wantForm.amount.value = want.amount;
    wantForm.priority.value = want.priority;
    wantForm.status.value = want.status;

    document.getElementById('want-form-title').innerText = 'EDIT WANT';
    document.getElementById('want-submit-btn').innerText = 'Update Want';
    document.getElementById('cancel-want-edit-btn').style.display = 'block';
    wantForm.scrollIntoView({ behavior: 'smooth' });
}

function resetWantForm() {
    if (!wantForm) return;
    wantForm.reset();
}

function cancelEditWant() {
    editingWantId = null;
    resetWantForm();
    document.getElementById('want-form-title').innerText = 'NEW WANT';
    document.getElementById('want-submit-btn').innerText = 'Add Want';
    document.getElementById('cancel-want-edit-btn').style.display = 'none';
}

function renderWantsView() {
    let totalIncome = 0;
    let totalExpenses = 0;

    transactions.forEach(t => {
        if (t.type === 'income') {
            totalIncome += parseFloat(t.amount);
        } else if (t.type === 'expense') {
            totalExpenses += parseFloat(t.amount);
        }
    });

    const totalBalance = totalIncome - totalExpenses;
    const allocableBudget = Math.max(0, totalBalance * (wantsAllocationPct / 100));

    let activeWantsTotal = 0;
    wants.forEach(w => {
        if (w.status === 'wanted') {
            activeWantsTotal += parseFloat(w.amount) || 0;
        }
    });

    const formatCurrency = (num) => '₱' + num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    document.getElementById('wants-total-balance').innerText = formatCurrency(totalBalance);
    document.getElementById('wants-allocable-budget').innerText = formatCurrency(allocableBudget);
    document.getElementById('wants-active-cost').innerText = formatCurrency(activeWantsTotal);

    document.getElementById('wants-allocation-slider').value = wantsAllocationPct;
    document.getElementById('wants-allocation-input').value = wantsAllocationPct;
    document.getElementById('wants-pct-label').innerText = `${wantsAllocationPct}%`;

    const tableBody = document.getElementById('wants-list-table-body');
    if (!tableBody) return;
    tableBody.innerHTML = '';

    wants.forEach(want => {
        const amt = parseFloat(want.amount) || 0;
        const formattedAmount = `₱${amt.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

        const priorityClass = `priority-${want.priority}`;
        const statusClass = want.status === 'bought' ? 'status-bought' : 'status-wanted';
        const statusText = want.status === 'bought' ? 'Bought' : 'Wanted';

        const tr = document.createElement('tr');

        const isAffordable = want.status === 'wanted' && amt <= allocableBudget;
        if (isAffordable) {
            tr.className = 'affordable-want';
        }

        tr.innerHTML = `
            <td><strong>${want.title}</strong></td>
            <td>${formattedAmount}</td>
            <td><span class="priority-badge ${priorityClass}">${want.priority}</span></td>
            <td><span class="status-badge ${statusClass}" title="Click to cycle status">${statusText}</span></td>
            <td class="actions-col">
                <div class="action-btns">
                    <button class="btn-action edit-btn">Edit</button>
                    <button class="btn-action del-btn">Del</button>
                </div>
            </td>
        `;

        tr.querySelector('.del-btn').addEventListener('click', () => {
            if (confirm(`Delete want "${want.title}"?`)) {
                deleteWant(want.id);
            }
        });

        tr.querySelector('.edit-btn').addEventListener('click', () => {
            startEditWant(want);
        });

        tr.querySelector('.status-badge').addEventListener('click', () => {
            cycleWantStatus(want);
        });

        tableBody.appendChild(tr);
    });
}

function initWantsForm() {
    if (!wantForm) return;

    wantForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const wantData = {
            title: wantForm.title.value.trim(),
            amount: parseFloat(wantForm.amount.value),
            priority: wantForm.priority.value,
            status: wantForm.status.value
        };

        if (!wantData.title || isNaN(wantData.amount)) {
            alert('Please fill out the form correctly.');
            return;
        }

        if (editingWantId) {
            const updatedWant = { id: editingWantId, ...wantData };
            await updateWant(editingWantId, updatedWant);
            if (wantData.status === 'bought') {
                await promptAutoExpenseWant(updatedWant);
            }
            cancelEditWant();
        } else {
            const newWant = {
                id: 'want-' + Date.now(),
                ...wantData
            };
            await addWant(newWant);
            if (newWant.status === 'bought') {
                await promptAutoExpenseWant(newWant);
            }
            resetWantForm();
        }
    });

    const cancelBtn = document.getElementById('cancel-want-edit-btn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', cancelEditWant);
    }
}

function initWantsAllocationControls() {
    const slider = document.getElementById('wants-allocation-slider');
    const numberInput = document.getElementById('wants-allocation-input');
    const label = document.getElementById('wants-pct-label');

    if (!slider || !numberInput) return;

    function updateAllocation(val) {
        let pct = parseInt(val);
        if (isNaN(pct)) pct = 10;
        pct = Math.max(0, Math.min(100, pct));

        wantsAllocationPct = pct;
        localStorage.setItem('nothing_budget_wants_pct', pct);

        slider.value = pct;
        numberInput.value = pct;
        if (label) label.innerText = `${pct}%`;

        if (currentView === 'wants') {
            renderWantsView();
        }
    }

    slider.addEventListener('input', (e) => {
        updateAllocation(e.target.value);
    });

    numberInput.addEventListener('input', (e) => {
        updateAllocation(e.target.value);
    });
}

// --- Tab Navigation & Routing Logic ---
const views = {
    dashboard: {
        el: document.getElementById('view-dashboard'),
        title: 'OVERVIEW'
    },
    budgets: {
        el: document.getElementById('view-budgets'),
        title: 'BUDGETS'
    },
    bills: {
        el: document.getElementById('view-bills'),
        title: 'BILLS'
    },
    wants: {
        el: document.getElementById('view-wants'),
        title: 'WANTS'
    },
    analytics: {
        el: document.getElementById('view-analytics'),
        title: 'ANALYTICS'
    },
    profile: {
        el: document.getElementById('view-profile'),
        title: 'PROFILE'
    },
    transactions: {
        el: document.getElementById('view-transactions'),
        title: 'TRANSACTIONS'
    }
};

// Mobile Sidebar Utility
function toggleMobileSidebar(isOpen) {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (!sidebar || !overlay) return;
    
    if (isOpen) {
        sidebar.classList.add('open');
        overlay.classList.add('visible');
    } else {
        sidebar.classList.remove('open');
        overlay.classList.remove('visible');
    }
}

function switchView(viewName) {
    const vName = viewName.toLowerCase();

    // Handle coming soon tabs
    if (vName === 'goals' || vName === 'reports') {
        currentView = vName;
        // Hide all views
        Object.keys(views).forEach(v => {
            if (views[v].el) views[v].el.style.display = 'none';
        });
        document.getElementById('page-title').innerHTML = `${vName.toUpperCase()}<br><span id="current-month-display">COMING SOON</span>`;

        // Update top menu active class
        document.querySelectorAll('.top-menu li').forEach(li => {
            if (li.innerText.trim().toLowerCase() === vName) {
                li.classList.add('active');
            } else {
                li.classList.remove('active');
            }
        });
        return;
    }

    if (!views[vName]) return;
    currentView = vName;

    // Hide all views
    Object.keys(views).forEach(v => {
        if (views[v].el) {
            views[v].el.style.display = 'none';
        }
    });

    // Dashboard shows both cards and transactions table
    if (currentView === 'dashboard') {
        if (views.dashboard.el) views.dashboard.el.style.display = 'block';
        if (views.transactions.el) views.transactions.el.style.display = 'block';

        // Hide Filter & Sort on Dashboard and make Quick Add span full width
        const filterSection = document.getElementById('filter-sort-section');
        const transGrid = document.getElementById('transaction-grid');
        if (filterSection) filterSection.style.display = 'none';
        if (transGrid) transGrid.style.gridTemplateColumns = '1fr';
    } else {
        if (views[currentView] && views[currentView].el) {
            views[currentView].el.style.display = 'block';
        }

        // Ensure Filter & Sort is visible and styled as 2 columns on Transactions view
        if (currentView === 'transactions') {
            const filterSection = document.getElementById('filter-sort-section');
            const transGrid = document.getElementById('transaction-grid');
            if (filterSection) filterSection.style.display = 'block';
            if (transGrid) transGrid.style.gridTemplateColumns = '1fr 1fr';
        }
    }

    // Update title text
    const titleText = views[currentView].title;
    if (currentMonth) {
        const [year, month] = currentMonth.split('-');
        const dateObj = new Date(year, parseInt(month) - 1, 1);
        const monthName = dateObj.toLocaleString('en-US', { month: 'long' }).toUpperCase();
        document.getElementById('page-title').innerHTML = `${titleText}<br><span id="current-month-display">${monthName} ${year}</span>`;
    } else {
        document.getElementById('page-title').innerHTML = `${titleText}<br><span id="current-month-display"></span>`;
    }

    // Update sidebar links active class
    document.querySelectorAll('.nav-links li').forEach(li => {
        const viewAttr = li.getAttribute('data-view');
        if (viewAttr === currentView) {
            li.classList.add('active');
        } else {
            li.classList.remove('active');
        }
    });

    // Update top menu active class
    document.querySelectorAll('.top-menu li').forEach(li => {
        const text = li.innerText.trim().toLowerCase();
        if (text === currentView) {
            li.classList.add('active');
        } else {
            li.classList.remove('active');
        }
    });

    // Run special subview renderers
    if (currentView === 'dashboard') {
        drawSparkline();
        updateBudgetUtilization();
    } else if (currentView === 'budgets') {
        renderBudgetsView();
    } else if (currentView === 'analytics') {
        renderAnalyticsView();
    } else if (currentView === 'profile') {
        renderProfileView();
    } else if (currentView === 'bills') {
        renderBillsView();
    } else if (currentView === 'wants') {
        renderWantsView();
    }
    toggleMobileSidebar(false);
}

// Bind Navigation Clicks
document.querySelectorAll('.nav-links li').forEach(item => {
    item.addEventListener('click', () => {
        const v = item.getAttribute('data-view');
        if (v) switchView(v);
    });
});

document.querySelectorAll('.top-menu li').forEach(item => {
    item.addEventListener('click', (e) => {
        const targetView = e.target.innerText.trim().toLowerCase();
        switchView(targetView);
    });
});

// Bind Month Filter Input Change
document.getElementById('month-filter').addEventListener('change', (e) => {
    currentMonth = e.target.value;
    updateHeader();
    renderTransactions();
    updateDashboard();
    drawSparkline();

    // Update subviews if active
    if (currentView === 'budgets') renderBudgetsView();
    else if (currentView === 'analytics') renderAnalyticsView();
    else if (currentView === 'profile') renderProfileView();
    else if (currentView === 'bills') renderBillsView();
    else if (currentView === 'wants') renderWantsView();
});

// Initialize App
document.addEventListener('DOMContentLoaded', async () => {
    populateCategoryDropdowns();
    initBudgetsForm();
    initProfileControls();
    initFilterListeners();
    resetTransactionForm();
    initBillsForm();
    resetBillForm();
    initWantsForm();
    resetWantForm();
    initWantsAllocationControls();
    
    // Detect database mode first
    await detectDatabaseMode();
    
    // Bind toggle click listener
    const toggleBtn = document.getElementById('btn-db-toggle');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleDatabaseMode);
    }
    
    // Bind mobile drawer toggle listeners
    const sidebarToggle = document.getElementById('btn-sidebar-toggle');
    const sidebarClose = document.getElementById('btn-sidebar-close');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => toggleMobileSidebar(true));
    }
    if (sidebarClose) {
        sidebarClose.addEventListener('click', () => toggleMobileSidebar(false));
    }
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', () => toggleMobileSidebar(false));
    }
    
    loadTransactions();
    loadBills();
    loadWants();
});