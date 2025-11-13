import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Route } from "react-router";
import { Routes } from "react-router";
import ProtectedRoute from "./routes/ProtectedRoute.tsx";
import Login from "./pages/Login.tsx";
import toast, { Toaster } from 'react-hot-toast';

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Toaster />
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route element={<ProtectedRoute/>}>
         <Route path="/dashboard" element={<App/>}/>
      </Route>
    </Routes>
    </BrowserRouter>
  </StrictMode>
);
