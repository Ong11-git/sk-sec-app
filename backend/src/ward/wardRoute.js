import express from "express";
import { authenticateToken, authorizeAdminOrUser } from "../middlewares/authMiddleware.js";
import {
  getAllWards,
  getWardsByGpu,
  createWard,
  updateWard,
  deleteWard,
  getAllWardsByGpuId
} from "./wardServices.js";

const wardRouter = express.Router();

// ✅ GET /wards - get all wards with hierarchy
wardRouter.get("/", authenticateToken, authorizeAdminOrUser, async (req, res) => {
  try {
    const wards = await getAllWards();
    // ✅ Pretty-print the full JSON object in console
    console.log("Fetched Wards (raw):");
    console.log(JSON.stringify(wards, null, 2));
    res.json(wards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ GET /wards/by-gpu/:gpuId
wardRouter.get("/by-gpu/:gpuId", authenticateToken, authorizeAdminOrUser, async (req, res) => {
  try {
    const { gpuId } = req.params;
    const wards = await getWardsByGpu(Number(gpuId));
    res.json(wards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ POST /wards/create
wardRouter.post("/create", authenticateToken, authorizeAdminOrUser, async (req, res) => {
  try {
    const { ward_no, ward_name, gpuId } = req.body;
    if (!ward_no || !ward_name || !gpuId) {
      return res.status(400).json({ error: "ward_no, ward_name and gpuId are required" });
    }

    const ward = await createWard({ ward_no, ward_name, gpuId });
    res.status(201).json(ward);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ PUT /wards/edit/:id
wardRouter.put("/edit/:id", authenticateToken, authorizeAdminOrUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { ward_no, ward_name, gpuId } = req.body;
    if (!ward_no || !ward_name || !gpuId) {
      return res.status(400).json({ error: "ward_no, ward_name and gpuId are required" });
    }

    const updatedWard = await updateWard(id, { ward_no, ward_name, gpuId });
    res.json(updatedWard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ DELETE /wards/delete/:id
wardRouter.delete("/delete/:id", authenticateToken, authorizeAdminOrUser, async (req, res) => {
  try {
    const { id } = req.params;
    await deleteWard(id);
    res.json({ message: "Ward deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

wardRouter.get("/by-gpu/:gpuId", authenticateToken, authorizeAdminOrUser, async (req, res) => {
  try {
    const { gpuId } = req.params;
    const wards = await getAllWardsByGpuId(gpuId);

    // Always return an array (empty if none)
    res.json(wards);
  } catch (error) {
    console.error("Error fetching wards by GPU:", error);
    res.status(500).json({ error: error.message });
  }
});




export default wardRouter;
