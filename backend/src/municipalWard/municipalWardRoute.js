import express from "express";
// import { authenticateToken } from "../middleware/authenticateToken.js";
import {
  authenticateToken,
  authorizeAdminOrUser,
  authorizeAdmin,
} from "../middlewares/authMiddleware.js";
import {
  createMunicipalWard,
  updateMunicipalWard,
  getMunicipalWardsByMunicipality,
  getAllMunicipalWards,
  deleteMunicipalWard,
} from "./municipalWardService.js";


const municipalWardRouter = express.Router();

/**
 * POST /municipal-wards/create
 */
municipalWardRouter.post(
  "/create",
  authenticateToken,
  authorizeAdminOrUser,
  async (req, res) => {
    try {
      const { name, wardNo, municipalityId } = req.body;

      if (!name || !wardNo || !municipalityId) {
        return res.status(400).json({
          error: "name, wardNo and municipalityId are required",
        });
      }

      const ward = await createMunicipalWard({
        name,
        wardNo,
        municipalityId,
      });

      res.status(201).json({
        message: "Municipal ward created successfully",
        ward,
      });
    } catch (error) {
      console.error("Error creating municipal ward:", error.message);
      res.status(400).json({ error: error.message });
    }
  }
);

/**
 * PUT /municipal-wards/edit/:id
 */
municipalWardRouter.put(
  "/edit/:id",
  authenticateToken,
  authorizeAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { name, wardNo } = req.body;

      if (!name || !wardNo) {
        return res.status(400).json({
          error: "name and wardNo are required",
        });
      }

      const ward = await updateMunicipalWard(id, name, wardNo);

      res.json({
        message: "Municipal ward updated successfully",
        ward,
      });
    } catch (error) {
      console.error("Error updating municipal ward:", error.message);
      res.status(400).json({ error: error.message });
    }
  }
);

/**
 * GET /municipal-wards/municipality/:municipalityId
 */
municipalWardRouter.get(
  "/municipality/:municipalityId",
  authenticateToken,
  async (req, res) => {
    try {
      const { municipalityId } = req.params;

      const wards = await getMunicipalWardsByMunicipality(municipalityId);

      res.json({ wards });
    } catch (error) {
      console.error("Error fetching municipal wards:", error.message);
      res.status(400).json({ error: error.message });
    }
  }
);

/**
 * GET /municipal-wards/all
 */
municipalWardRouter.get(
  "/all",
  authenticateToken,
  authorizeAdminOrUser,
  async (req, res) => {
    try {
      const wards = await getAllMunicipalWards();
      res.json({ wards });
    } catch (error) {
      console.error("Error fetching all municipal wards:", error.message);
      res.status(500).json({ error: "Failed to fetch municipal wards" });
    }
  }
);


/**
 * DELETE /municipal-wards/delete/:id
 */
municipalWardRouter.delete(
  "/delete/:id",
  authenticateToken,
  authorizeAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;

      const deletedWard = await deleteMunicipalWard(id);

      res.json({
        message: "Municipal ward deleted successfully",
        ward: deletedWard,
      });
    } catch (error) {
      console.error("Error deleting municipal ward:", error.message);
      res.status(400).json({ error: error.message });
    }
  }
);

export default municipalWardRouter;
