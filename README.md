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

## Getting Started
#Clone the repository
git clone https://github.com/Ong11-git/sk-sec-app.git
cd sk-sec-app

## Backend Setup
cd backend
npm install
##Initialize Prisma
npx prisma migrate dev --name init
##Run the backend server

