# Bank Simulator [Used Claude for front end but manually coded backend in c , which is direclty coded to JS and CSS ]

A beginner-level interactive banking simulator: sign up or log in, then check your balance, withdraw, or deposit — all in the browser. The web app is a JavaScript reimplementation of the same rules originally written in C

## Project structure

```
banking-simulator/
├── index.html          # Portal, login/signup, dashboard screens
├── style.css            # Passbook / ATM-receipt styled UI
├── script.js             # App logic (accounts, login, transactions)
├── backend/
│   ├── banking.c         # Original C program, as first written
│   └── banking_fixed.c   # Same C program with the bugs below fixed
└── README.md
```

## How the frontend and backend connect

**They don't — by design, and it's worth understanding why.** `script.js` and `banking.c` are two separate, independent programs that happen to implement the same rules. Clicking "Withdraw" in the browser runs JavaScript code directly; it never touches the `.c` files, and the C programs never read anything the browser stores.

This is because a browser can only run HTML/CSS/JavaScript natively — it cannot execute a `.c` file. To make a `.c` program the *actual* logic engine behind a live website, one of these would be needed instead:

| Approach | How it would work | Trade-off |
|---|---|---|
| **What this project uses** | JS reimplements the same rules independently | Simplest — runs instantly on GitHub Pages, no server needed |
| **Compile C to WebAssembly** (Emscripten) | The real `banking.c` compiles to `.wasm` and runs inside the browser | A true connection, but reworking `scanf`/stdin input for the browser is nontrivial |
| **A backend server** (e.g. Node.js) | A server runs the compiled C program as a subprocess; the frontend sends clicks over the network; the server pipes them into the program's stdin/stdout | True frontend↔backend link, but needs a server host — GitHub Pages only serves static files, so this wouldn't work there |

For a project meant to be a shareable link, the current setup (independent JS port) is the right trade-off. If this is being submitted for a class, it's worth stating explicitly: **the live web app is a JavaScript port of the C logic, not the C program running live.**

## Run it locally

No build step needed — it's plain HTML/CSS/JS.

1. Download or clone the folder.
2. Open `index.html` in any browser (double-click it, or right-click → Open with → your browser).

That's it. Account data is saved in the browser's local storage, so it'll persist between visits on the same device/browser.

## What changed from your C code, and why

Your original `banking.c` is kept as-is in `backend/` — nothing in it was edited. `banking_fixed.c` is a separate file with the same bugs fixed directly in C, in case you want the fix in the original language too. `script.js` independently reimplements the **same rules** (account number, password, credit score gate, balance/withdraw/deposit, 3 login tries, exit back to portal) in JavaScript, with the same fixes applied. The bugs, in both cases:

### Quick checklist before sharing
- [ ] Test signup → login → withdraw → deposit → exit yourself first
- [ ] Try a credit score under 600 to confirm the "not eligible" screen shows
- [ ] Try 3 wrong logins to confirm the lockout message shows
- [ ] Push to GitHub and enable Pages
- [ ] Send the Pages link to friends
