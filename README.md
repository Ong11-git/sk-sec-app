# 🗳️ SK_SEC_APP

A full-stack web application built with **React**, **Node.js**, **Express**, and **Prisma ORM** — designed to manage voter and administrative data with a structured hierarchy (District, Constituency, TC, GPU, Ward, etc.).

---

## 📁 Project Structure

# sk-sec-app
sk_sec_app/
├── frontend/ # React + Vite (UI Layer)
├── backend/ # Node.js + Express + Prisma + PostgreSQL (API Layer)
└── README.md


---

## 🧰 Tech Stack

| Layer | Technology | Purpose |
|--------|-------------|----------|
| **Frontend** | **React + Vite** | User interface and client-side routing |
| | **Tailwind CSS + DaisyUI** | Modern, responsive UI styling |
| | **React Router v7** | Handles routing between views |
| | **React Hot Toast** | Toast notifications for UX feedback |
| | **Recharts** | Graphs and data visualization |
| **Backend** | **Node.js + Express** | REST API server |
| | **Prisma ORM** | Database modeling and type-safe queries |
| | **PostgreSQL** | Relational database |
| | **JWT (jsonwebtoken)** | Authentication and authorization |
| | **bcrypt** | Password hashing |
| | **Multer** | File uploads |
| | **pdf-parse, xlsx** | PDF and Excel parsing |
| **Development Tools** | **nodemon** | Auto-restart backend during development |
| | **TypeScript + ESLint** | Type checking and linting for frontend |
| | **Vite** | Fast development/build tool for React |

---

## ⚙️ Prerequisites

Before running the project, make sure you have:

- [Node.js](https://nodejs.org/) ≥ 18.x  
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)  
- [PostgreSQL](https://www.postgresql.org/) ≥ 14.x  
- A `.env` file configured (see below)

---

## 🧾 Environment Variables

Create a `.env` file inside the **backend** folder:

```env
# Database connection (PostgreSQL)
DATABASE_URL="postgresql://<user>:<password>@localhost:5432/<dbname>?schema=public"

# JWT Secret Key
JWT_SECRET=372c0e39082687e8cb342f8cae73b59c349d912d5be6d534a8488f3cb20e2eac83ed2ebdff7dbe7ac2f51c164124b0212cb4ffe6cde8c73b4e859cf304e95074
JWT_EXPIRES_IN=1d

# Admin Credential
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin@123
#File Upload
UPLOAD_DIR=./uploads


# ===================================================
# 🚀 Project Setup Guide: sk-sec-app
# ===================================================

# 🧭 STEP 1: Clone the Repository
git clone https://github.com/Ong11-git/sk-sec-app.git
cd sk-sec-app

# ===================================================
# ⚙️ STEP 2: BACKEND SETUP (Node.js + Prisma)
# ===================================================
cd backend

# Install all backend dependencies
npm install

# Initialize Prisma and apply migrations
npx prisma migrate dev --name init

# ===================================================
# 💻 STEP 3: FRONTEND SETUP (React JS)
# ===================================================
cd ../frontend

# Install all frontend dependencies
npm install

# ===================================================
# 🧩 STEP 4: PROJECT STRUCTURE
# ===================================================
# sk-sec-app/
# ├── backend/          # Node.js + Express + Prisma API
# ├── frontend/         # React.js UI
# ├── package.json      # Root config (for running both together)
# ├── README.md         # Setup guide
# └── .gitignore        # Ignored files

# ===================================================
# 🔁 STEP 5: SETUP ROOT PACKAGE TO RUN BOTH
# ===================================================
# Go to project root
cd ..

# Create a root package.json if not already present
npm init -y

# Install concurrently to run both frontend & backend together
npm install concurrently --save-dev

# ===================================================
# 🛠 STEP 6: EDIT ROOT package.json
# ===================================================
# Open the root-level package.json and add these scripts:

# {
#   "name": "sk-sec-app",
#   "version": "1.0.0",
#   "private": true,
#   "scripts": {
#     "start": "concurrently \"npm run server\" \"npm run client\"",
#     "server": "cd backend && npm start",
#     "client": "cd frontend && npm start"
#   },
#   "devDependencies": {
#     "concurrently": "^8.0.0"
#   }
# }

# ===================================================
# ▶️ STEP 7: RUN BOTH SERVERS TOGETHER
# ===================================================

npm start

# This command will:
# ✅ Start backend server (Node.js + Prisma)
# ✅ Start frontend server (React)
# ✅ Both run simultaneously

# Backend: http://localhost:5000
# Frontend: http://localhost:3000

# ===================================================
# 🌐 STEP 8: GIT COMMANDS (Push everything)
# ===================================================

# Add all files (backend + frontend + root)
git add .

# Commit changes
git commit -m "Initial commit with full setup (frontend + backend + concurrently)"

# Pull remote to avoid conflicts
git pull origin main --rebase

# Push to GitHub
git push origin main

# ===================================================
# ✅ Done!
# Your full-stack app (frontend + backend) is now live on GitHub.
# Run both with: npm start
# ===================================================


