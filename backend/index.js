
import "dotenv/config";

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import userRouter from "./src/user/userRouter.js";
import { seedAdmin } from "./src/admin/seedAdmin.js";
import pdfRouter from "./src/pdf/pdfRoute.js";
import voterRouter from "./src/voterList/voterRoute.js";
import constituencyRouter from "./src/constituency/constituencyRoute.js";
import districtRouter from "./src/district/districtRoute.js";
import tcRouter from "./src/tc/tcRoute.js";
import { seedDistricts } from "./src/district/seedDistricts.js";
import gpuRouter from "./src/gpu/gpuRoute.js";
import wardRouter from "./src/ward/wardRoute.js";
import municipalityRouter from "./src/municipality/municipalityRoute.js";
import municipalWardRouter from "./src/municipalWard/municipalWardRoute.js";
import analyticsRouter from "./src/analytics/analyticsRoute.js";
import { seedVoters } from "./src/voterList/seedVoters.js";
import { seedAllData } from "./src/seeds/seedAllData.js";

const app = express();

const PORT = Number(process.env.PORT) || 3014;
const HOST = "0.0.0.0";

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://apisksecvoters.bolds.cloud",
      "https://sksecvoters.bolds.cloud"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API routes
app.use("/user", userRouter);
app.use("/analytics", analyticsRouter);
app.use("/pdf", pdfRouter);
app.use("/voters", voterRouter);
app.use("/constituencies", constituencyRouter);
app.use("/municipalities", municipalityRouter);
app.use("/districts", districtRouter);
app.use("/tcs", tcRouter);
app.use("/gpus", gpuRouter);
app.use("/wards", wardRouter);
app.use("/municipal-wards", municipalWardRouter);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running",
    port: PORT,
    timestamp: new Date().toISOString(),
  });
});

// Initialize database seeds and start server
async function startServer() {
  try {
    console.log("Initializing application...");

    await seedAdmin();
    await seedDistricts();
    await seedAllData();
    await seedVoters();

    app.listen(PORT, HOST, () => {
      console.log(`API running at http://${HOST}:${PORT}`);
    });
  } catch (error) {
    console.error("Application startup failed:", error);
    process.exit(1);
  }
}

startServer();

export default app;
