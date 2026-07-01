/* ============================================================
   Bank Simulator (frontend)
   This mirrors the RULES of backend/banking.c 1:1 — same fields
   (account number, password, credit score, balance), same flow
   (login or signup -> credit score gate -> balance/withdraw/deposit
   -> exit back to portal) — but as a browser app, since a .c file
   can't run in a browser.

   Fixes made vs. the original C logic (kept the spirit, fixed the bugs):
   1. Login now checks the entered number/password against a STORED
      account. The original compared d1[i].num==d1[i].num, which is
      always true (comparing a value to itself), so login never
      actually failed.
   2. Balance now starts at 0 only when an account is CREATED, and
      persists after that. The original reset net_amt=0 every time
      "Check balance" was chosen (case '1'), wiping the balance.
   3. Multiple accounts are supported (stored by account number),
      matching the intent of `struct data d1[50]`.
   4. Withdraw amount is validated as a positive number before the
      balance check (the original checked amount<0 only after
      already comparing it to the balance).
   ============================================================ */

const STORAGE_KEY = 'bank_simulator_accounts';
const TRIES_LIMIT = 3;

let session = {
  currentAccountNum: null,
  triesLeft: TRIES_LIMIT,
  pendingAction: null // 'withdraw' | 'deposit'
};

/* ---------- storage helpers ---------- */
function loadAccounts() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}
function saveAccounts(accounts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
}
function findAccount(num) {
  return loadAccounts().find(a => a.num === num);
}
function updateAccount(num, updates) {
  const accounts = loadAccounts();
  const idx = accounts.findIndex(a => a.num === num);
  if (idx === -1) return;
  accounts[idx] = { ...accounts[idx], ...updates };
  saveAccounts(accounts);
}

/* ---------- screen / tab helpers ---------- */
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}
function switchTab(tab) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelector(`.tab[data-tab="${tab}"]`).classList.add('active');
  document.getElementById('tab-login').style.display = tab === 'login' ? 'block' : 'none';
  document.getElementById('tab-signup').style.display = tab === 'signup' ? 'block' : 'none';
  clearError('login-error');
  clearError('signup-error');
}
function showError(elId, msg) {
  const el = document.getElementById(elId);
  el.textContent = msg;
  el.classList.add('show');
}
function clearError(elId) {
  const el = document.getElementById(elId);
  el.textContent = '';
  el.classList.remove('show');
}

/* ---------- signup ---------- */
function handleSignup(e) {
  e.preventDefault();
  clearError('signup-error');

  const num = document.getElementById('signup-num').value.trim();
  const pass = document.getElementById('signup-pass').value.trim();
  const score = parseInt(document.getElementById('signup-score').value, 10);

  if (!num || !pass) {
    showError('signup-error', 'Account number and password are required.');
    return;
  }
  if (findAccount(num)) {
    showError('signup-error', 'That account number is already taken. Try another.');
    return;
  }
  if (isNaN(score) || score < 300 || score > 900) {
    showError('signup-error', 'Credit score must be between 300 and 900.');
    return;
  }

  const accounts = loadAccounts();
  accounts.push({ num, pass, cScore: score, balance: 0 });
  saveAccounts(accounts);

  document.getElementById('signup-form').reset();
  enterAccount(num);
}

/* ---------- login ---------- */
function handleLogin(e) {
  e.preventDefault();
  clearError('login-error');

  const num = document.getElementById('login-num').value.trim();
  const pass = document.getElementById('login-pass').value.trim();

  const account = findAccount(num);

  if (account && account.pass === pass) {
    session.triesLeft = TRIES_LIMIT;
    document.getElementById('login-form').reset();
    enterAccount(num);
    return;
  }

  session.triesLeft--;
  if (session.triesLeft <= 0) {
    showError('login-error', 'You have exceeded the maximum number of tries. Please try again later.');
    document.getElementById('login-form').querySelector('button').disabled = true;
    setTimeout(() => {
      session.triesLeft = TRIES_LIMIT;
      document.getElementById('login-form').querySelector('button').disabled = false;
      clearError('login-error');
    }, 4000);
  } else {
    showError('login-error', `Invalid account number or password. ${session.triesLeft} ${session.triesLeft === 1 ? 'try' : 'tries'} left.`);
  }
}

/* ---------- entering an account (credit-score gate, same as original) ---------- */
function enterAccount(num) {
  const account = findAccount(num);
  session.currentAccountNum = num;

  if (account.cScore < 600) {
    showScreen('screen-ineligible');
    return;
  }
  renderDashboard();
  showScreen('screen-dashboard');
}

/* ---------- dashboard ---------- */
function renderDashboard() {
  const account = findAccount(session.currentAccountNum);
  document.getElementById('dash-acct-num').textContent = account.num;
  document.getElementById('dash-score').textContent = `Score ${account.cScore}`;
  document.getElementById('dash-balance').textContent = account.balance;
  document.getElementById('receipt-feed').innerHTML =
    '<div class="receipt-empty">No transactions yet — actions you take will print here.</div>';
}

function printReceipt(label, detail) {
  const feed = document.getElementById('receipt-feed');
  const empty = feed.querySelector('.receipt-empty');
  if (empty) empty.remove();

  const line = document.createElement('div');
  line.className = 'receipt-line';
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  line.innerHTML = `<span>${label}</span><span class="rl-time">${detail} · ${time}</span>`;
  feed.prepend(line);
}

function doCheckBalance() {
  const account = findAccount(session.currentAccountNum);
  document.getElementById('dash-balance').textContent = account.balance;
  printReceipt('Check balance', `₹${account.balance}`);
}

/* ---------- withdraw / deposit modal ---------- */
function openAmountModal(action) {
  session.pendingAction = action;
  document.getElementById('modal-title').textContent = action === 'withdraw' ? 'Withdraw' : 'Deposit';
  document.getElementById('modal-submit').textContent = action === 'withdraw' ? 'Withdraw' : 'Deposit';
  document.getElementById('amount-input').value = '';
  clearError('modal-error');
  document.getElementById('amount-overlay').classList.add('show');
  document.getElementById('amount-input').focus();
}
function closeAmountModal() {
  document.getElementById('amount-overlay').classList.remove('show');
  session.pendingAction = null;
}

function handleAmountSubmit(e) {
  e.preventDefault();
  clearError('modal-error');

  const amt = parseInt(document.getElementById('amount-input').value, 10);
  const account = findAccount(session.currentAccountNum);

  if (isNaN(amt) || amt <= 0) {
    showError('modal-error', 'Enter a positive amount.');
    return;
  }

  if (session.pendingAction === 'withdraw') {
    if (account.balance === 0) {
      showError('modal-error', 'Your balance is zero — deposit first.');
      return;
    }
    if (amt > account.balance) {
      showError('modal-error', 'You cannot withdraw more than your balance.');
      return;
    }
    const newBalance = account.balance - amt;
    updateAccount(account.num, { balance: newBalance });
    document.getElementById('dash-balance').textContent = newBalance;
    printReceipt('Withdraw', `-₹${amt}`);
  } else {
    const newBalance = account.balance + amt;
    updateAccount(account.num, { balance: newBalance });
    document.getElementById('dash-balance').textContent = newBalance;
    printReceipt('Deposit', `+₹${amt}`);
  }

  closeAmountModal();
}

/* ---------- exit back to portal ---------- */
function exitToPortal() {
  session.currentAccountNum = null;
  session.triesLeft = TRIES_LIMIT;
  document.getElementById('login-form').reset();
  clearError('login-error');
  switchTab('login');
  showScreen('screen-portal');
}
