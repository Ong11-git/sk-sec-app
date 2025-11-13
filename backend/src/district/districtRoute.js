// src/district/districtRoute.js
import express from "express";
import { authenticateToken, authorizeAdmin, authorizeAdminOrUser } from "../middlewares/authMiddleware.js";
import { countDistricts,getAllDistricts,createDistrict,updateDistrict,deleteDistrict } from "./districtService.js";

const districtRouter = express.Router();

// GET /districts
districtRouter.get(
  "/",
  authenticateToken,
  authorizeAdminOrUser,
  async (req, res) => {
    try {
      const districts = await getAllDistricts();
      res.json(districts);
    } catch (error) {
      console.error("Error fetching districts:", error.message);
      res.status(500).json({ error: "Failed to fetch districts." });
    }
  }
);

// GET /districts/count
districtRouter.get(
  "/count",
  authenticateToken,
  authorizeAdminOrUser,
  async (req, res) => {
    try {
      const count = await countDistricts();
      res.json({ count });
    } catch (error) {
      console.error("Error fetching district count:", error.message);
      res.status(500).json({ error: "Failed to fetch district count." });
    }
  }
);

/**
 * POST /districts/create
 */
districtRouter.post("/create", authenticateToken, authorizeAdminOrUser, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Name is required" });

    const district = await createDistrict(name);
    res.status(201).json({ message: "District created successfully", district });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to create district" });
  }
});

/**
 * PUT /districts/edit/:id
 */
districtRouter.put("/edit/:id", authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) return res.status(400).json({ error: "Name is required" });

    const district = await updateDistrict(id, name);
    res.json({ message: "District updated successfully", district });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to update district" });
  }
});

/**
 * DELETE /districts/delete/:id
 */
districtRouter.delete("/delete/:id", authenticateToken, authorizeAdmin , async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteDistrict(id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to delete district" });
  }
});


export default districtRouter;
