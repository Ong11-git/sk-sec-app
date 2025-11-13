// src/user/userRouter.js
import express from "express";
import bodyParser from "body-parser";
import { createUser } from "./userService.js";
import { loginUser } from "./authService.js";
import { authenticateToken, authorizeAdmin } from "../middlewares/authMiddleware.js";

const userRouter = express.Router();
userRouter.use(bodyParser.json());


// // Health check
// userRouter.get("/hello", (req, res) => {
//   res.send("🚀 API is running...");
// });


userRouter.post(
  "/create-user",
  authenticateToken, // verify JWT first
  authorizeAdmin,    // check if user is admin
  async (req, res) => {
    try {
      const user = await createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      console.error("Error creating user:", error.message);
      res.status(400).json({ error: error.message });
    }
  }
);

// ✅ User login route
userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await loginUser(email, password); // call service
    res.json(result); // { token, user }
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(400).json({ error: error.message });
  }
});


export default userRouter;

