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
JWT_SECRET="your_secret_key_here"
