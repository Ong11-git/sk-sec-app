import express from "express";
import bodyParser from "body-parser";
import userRouter from "./src/user/userRouter.js";
import { seedAdmin } from "./src/admin/seedAdmin.js";
import pdfRouter from "./src/pdf/pdfRoute.js";
import cors from "cors";
import voterRouter from "./src/voterList/VoterRoute.js";
import constituencyRouter from "./src/constituency/constituencyRoute.js";
import districtRouter from "./src/district/districtRoute.js";
import tcRouter from "./src/tc/tcRoute.js";
import { seedConstituencies } from "./src/constituency/seedConstituencies.js";
import { seedDistricts } from "./src/district/seedDistricts.js";
import gpuRouter from "./src/gpu/gpuRoute.js";
import wardRouter from "./src/ward/wardRoute.js";
import municipalityRouter from "./src/municipality/municipalityRoute.js";
import municipalWardRouter from "./src/municipalWard/municipalWardRoute.js";
import analyticsRouter from "./src/analytics/analyticsRoute.js";

const app = express();
const PORT = 8080;

app.use(
  cors({
    origin: "http://localhost:5173", // Your React app URL
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(bodyParser.json());

seedAdmin();
seedDistricts();

// seedConstituencies();

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

app.listen(PORT, () =>
  console.log(`Server  running on port: http://localhost:${PORT}`)
);

export default app;
