# Sweet App

Sweet App is a small business app for keeping track of **clients**, **products (or services)**, and **invoices**. It is made for freelancers and small companies that need to send simple, professional invoices without paying for big accounting software.

The app is in **Bulgarian** and runs on your own computer.

---

## How to start it

You need two things running at the same time: the **backend** (the "brain") and the **frontend** (the website you see). Use two separate terminal windows.

### Before you start (one time setup)

1. **Java 25 or newer** — check with `java -version`
2. **Node.js** (version 20 or newer) — check with `node -v`
3. **PostgreSQL** installed and running, with:
   - user: `postgres`
   - password: `root`
   - database: `postgres`
   - port: `5432`

> These database details are in `javaspring-choson-backend/src/main/resources/application.yml`. If your PostgreSQL uses a different password, change it there.

### Terminal 1 — start the backend

```powershell
cd javaspring-choson-backend
.\gradlew bootRun
```

Wait until you see something like `Started SweetApplication`. The backend runs at `http://localhost:8080`.

### Terminal 2 — start the frontend

```powershell
cd choson-frontend
npm install
npm run dev
```

`npm install` only needs to run the first time. When it finishes, open the link it shows — usually **http://localhost:5173**.

### First time using the app

1. Open `http://localhost:5173`
2. Click **Регистрация** to create an account
3. Go to **Настройки на фактурите** and fill in your company details (name, address, VAT number, etc.) — these appear on every invoice
4. Add your **Клиенти** (clients)
5. Add your **Продукти** (products/services) with prices
6. Create your first **Фактура** (invoice)

### To stop

Press `Ctrl + C` in each terminal window.

---

## What you can do with it

- **Clients** — save customer details: name, email, phone, address, bank info, and tax numbers. Search, sort, edit, and delete them.
- **Products** — build a list of the things you sell, with a price, product number, and unit (pieces, hours, kg...).
- **Invoices** — pick a client, add products with quantities, and the app calculates the total for you. Each invoice gets its own number, due date, and payment details.
- **PDF invoices** — download any invoice as a ready-to-send PDF file.
- **Your own business details** — set them once, and they are printed on every invoice.
- **Private accounts** — each person logs in and only sees their own clients, products, and invoices. Passwords are stored encrypted.

The main screen also gives you a quick overview: how many clients, products, and pending invoices you have.

---

## How it is built (in plain words)

The project is made of two parts:

| Part | Folder | What it does |
|------|--------|--------------|
| **Frontend** | `choson-frontend/` | The website you click on. Built with React, TypeScript, and Tailwind CSS. |
| **Backend** | `javaspring-choson-backend/` | The server that saves and checks your data. Built with Java and Spring Boot, using a PostgreSQL database. |

When you use the app, the website talks to the backend, and the backend stores everything in the database on your computer.

Useful details:

- Frontend address: `http://localhost:5173`
- Backend address: `http://localhost:8080`
- All data is kept in your local PostgreSQL database — nothing is sent to the internet.

---

## Commands at a glance

| Task | Command |
|------|---------|
| Start backend | `cd javaspring-choson-backend` then `.\gradlew bootRun` |
| Build backend | `cd javaspring-choson-backend` then `.\gradlew build` |
| Start frontend | `cd choson-frontend` then `npm run dev` |
| Build frontend | `cd choson-frontend` then `npm run build` |
| Check frontend code | `cd choson-frontend` then `npm run lint` |

---

## If something goes wrong

- **Backend won't start** — make sure PostgreSQL is running and the username/password/database in `application.yml` match your setup.
- **Website shows no data or "Грешка"** — make sure the backend (Terminal 1) is still running.
- **Port already in use** — close the other program using port `8080` or `5173`, or restart your computer.
