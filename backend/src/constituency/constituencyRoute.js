// src/constituency/constituencyRoute.js
import express from "express";
import { authenticateToken, authorizeAdminOrUser, authorizeAdmin } from "../middlewares/authMiddleware.js";
import { countConstituencies,
          getAllConstituencies, 
          createConstituency, 
          updateConstituency, 
          deleteConstituency,
          getConstituenciesByDistrictId } from "./constituencyService.js";

const constituencyRouter = express.Router();

// GET /constituencies
constituencyRouter.get(
  "/all",
  authenticateToken,
  authorizeAdminOrUser,
  async (req, res) => {
    try {
      const constituencies = await getAllConstituencies();
      res.json(constituencies);
    } catch (error) {
      console.error("Error fetching constituencies:", error.message);
      res.status(500).json({ error: "Failed to fetch constituencies." });
    }
  }
);

// CREATE a constituency
constituencyRouter.post(
  "/create-constituency",
  authenticateToken,
  authorizeAdminOrUser,
  async (req, res) => {
    try {
      const { name, constituencyNo, districtIds } = req.body;

      if (!name || !constituencyNo) {
        return res.status(400).json({ error: "name and constituencyNo are required" });
      }

      const newConstituency = await createConstituency({
        name,
        constituencyNo,
        districtIds,
      });

      res.status(201).json({
        message: "✅ Constituency created successfully",
        constituency: newConstituency,
      });
    } catch (error) {
      console.error("Error creating constituency:", error.message);
      res.status(400).json({ error: error.message });
    }
  }
);



// GET /constituencies/count
constituencyRouter.get(
  "/count",
  authenticateToken,
  authorizeAdminOrUser,
  async (req, res) => {
    try {
      const count = await countConstituencies();
      res.json({ count });
    } catch (error) {
      console.error("Error fetching constituency count:", error.message);
      res.status(500).json({ error: "Failed to fetch constituency count." });
    }
  }
);

constituencyRouter.put("/edit/:id", 
  authenticateToken,
  authorizeAdmin,
  async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = req.body;
    console.log(data);
    const updatedConstituency = await updateConstituency(id, data);
    res.json({
      success: true,
      message: "Constituency updated successfully",
      data: updatedConstituency,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update constituency",
    });
  }
});

constituencyRouter.delete("/delete/:id",
  authenticateToken,
  authorizeAdmin,
  async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const deletedConstituency = await deleteConstituency(id);

    res.json({
      success: true,
      message: "Constituency deleted successfully",
      data: deletedConstituency,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete constituency",
    });
  }
});

constituencyRouter.get(
  "/by-district/:districtId",
  authenticateToken,
  authorizeAdminOrUser,
  async (req, res) => {
    try {
      const districtId = parseInt(req.params.districtId, 10);
      if (isNaN(districtId)) {
        return res.status(400).json({ error: "Invalid districtId" });
      }

      const constituencies = await getConstituenciesByDistrictId(districtId);
      res.json(constituencies);
    } catch (error) {
      console.error("Error fetching constituencies:", error.message);
      res.status(500).json({ error: "Failed to fetch constituencies." });
    }
  }
);

export default constituencyRouter;
