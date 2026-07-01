# Bank Simulator

#[Used Claude for Frontend , Backend coded manually in c]#

A beginner-level interactive banking simulator: sign up or log in, then check your balance, withdraw, or deposit — all in the browser. Built on top of a C backend logic that was later ported to a web frontend so friends can try it with just a link.

## Project structure

```
banking-simulator/
├── index.html          # Portal, login/signup, dashboard screens
├── style.css            # Passbook / ATM-receipt styled UI
├── script.js             # App logic (accounts, login, transactions)
├── backend/
│   └── banking.c        # Original C program (unchanged, kept for reference)
└── README.md
```

## Run it locally

No build step needed — it's plain HTML/CSS/JS.

1. Download or clone the folder.
2. Open `index.html` in any browser (double-click it, or right-click → Open with → your browser).

That's it. Account data is saved in the browser's local storage, so it'll persist between visits on the same device/browser.

## What changed from your C code, and why

Your `banking.c` is included as-is in `backend/` — nothing in it was edited. Since a browser can't execute C directly, `script.js` reimplements the **same rules** (account number, password, credit score gate, balance/withdraw/deposit, 3 login tries, exit back to portal) in JavaScript. While doing that, a few logic bugs in the original flow were fixed so the simulator actually behaves correctly:

### Quick checklist before sharing
- [ ] Test signup → login → withdraw → deposit → exit yourself first
- [ ] Try a credit score under 600 to confirm the "not eligible" screen shows
- [ ] Try 3 wrong logins to confirm the lockout message shows
- [ ] Push to GitHub and enable Pages

