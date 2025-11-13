import express from "express";
import { authenticateToken, authorizeAdminOrUser } from "../middlewares/authMiddleware.js";
import {
  getAllGpus,
  createGpu,
  updateGpu,
  deleteGpu,
  getGpusByTc
} from "./gpuService.js";

const gpuRouter = express.Router();

// ✅ GET /gpus - all GPUs
gpuRouter.get("/", authenticateToken, authorizeAdminOrUser, async (req, res) => {
  try {
    const gpus = await getAllGpus();
    // Pretty-print all GPU objects
    console.dir(gpus, { depth: null, colors: true });

    // Or as JSON string
    console.log(JSON.stringify(gpus, null, 2));
    res.json(gpus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ POST /gpus/create
gpuRouter.post("/create", authenticateToken, authorizeAdminOrUser, async (req, res) => {
  try {
    const { gpu_no, gpu_name, tcId } = req.body;
    if (!gpu_no || !gpu_name || !tcId)
      return res.status(400).json({ error: "gpu_no, gpu_name, and tcId are required" });

    const gpu = await createGpu({ gpu_no, gpu_name, tcId });
    res.status(201).json(gpu);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// ✅ PUT /gpus/edit/:id
gpuRouter.put("/edit/:id", authenticateToken, authorizeAdminOrUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { gpu_no, gpu_name, tcId } = req.body;
    if (!gpu_no || !gpu_name || !tcId)
      return res.status(400).json({ error: "gpu_no, gpu_name, and tcId are required" });

    const updatedGpu = await updateGpu(id, { gpu_no, gpu_name, tcId });
    res.json(updatedGpu);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ DELETE /gpus/delete/:id
gpuRouter.delete("/delete/:id", authenticateToken, authorizeAdminOrUser, async (req, res) => {
  try {
    const { id } = req.params;
    await deleteGpu(id);
    res.json({ message: "GPU deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

gpuRouter.get("/by-tc/:tcId", authenticateToken, authorizeAdminOrUser, async (req, res) => {
  try {
    const { tcId } = req.params;
    const gpus = await getGpusByTc(tcId);

    // ✅ Always return an array (empty if none found)
    res.json(gpus);
    
  } catch (error) {
    console.error("Error fetching GPUs by TC:", error);
    res.status(500).json({ error: error.message });
  }
});


export default gpuRouter;
