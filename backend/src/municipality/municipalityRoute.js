// src/municipality/municipalityRoute.js
import express from "express";
import {
  authenticateToken,
  authorizeAdminOrUser,
  authorizeAdmin,
} from "../middlewares/authMiddleware.js";

import {
  getAllMunicipalities,
  createMunicipality,
  updateMunicipality,
  deleteMunicipality,
  getMunicipalitiesByDistrictId,
  getMunicipalitiesByConstituencyId,
  countMunicipalities,
} from "./municipalityService.js";

const municipalityRouter = express.Router();

/**
 * GET /municipalities/all
 */
municipalityRouter.get(
  "/all",
  authenticateToken,
  authorizeAdminOrUser,
  async (req, res) => {
    try {
      const municipalities = await getAllMunicipalities();
      res.json(municipalities);
    } catch (error) {
      console.error("Error fetching municipalities:", error.message);
      res.status(500).json({ error: "Failed to fetch municipalities" });
    }
  }
);

/**
 * POST /municipalities/create
 */
municipalityRouter.post(
  "/create",
  authenticateToken,
  authorizeAdminOrUser,
  async (req, res) => {
    try {
      const { name, municipalityNo, districtId, constituencyId } = req.body;

      if (!name || !municipalityNo) {
        return res.status(400).json({
          error: "name and municipalityNo are required",
        });
      }

      const municipality = await createMunicipality({
        name,
        municipalityNo,
        districtId,
        constituencyId,
      });

      res.status(201).json({
        message: "Municipality created successfully",
        municipality,
      });
    } catch (error) {
      console.error("Error creating municipality:", error.message);
      res.status(400).json({ error: error.message });
    }
  }
);

/**
 * PUT /municipalities/edit/:id
 */
municipalityRouter.put(
  "/edit/:id",
  authenticateToken,
  authorizeAdmin,
  async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = req.body;

      const updated = await updateMunicipality(id, data);

      res.json({
        success: true,
        message: "Municipality updated successfully",
        data: updated,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to update municipality",
      });
    }
  }
);

/**
 * DELETE /municipalities/delete/:id
 */
municipalityRouter.delete(
  "/delete/:id",
  authenticateToken,
  authorizeAdmin,
  async (req, res) => {
    try {
      const id = parseInt(req.params.id);

      const deleted = await deleteMunicipality(id);

      res.json({
        success: true,
        message: "Municipality deleted successfully",
        data: deleted,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to delete municipality",
      });
    }
  }
);

/**
 * GET /municipalities/by-district/:districtId
 */
municipalityRouter.get(
  "/by-district/:districtId",
  authenticateToken,
  authorizeAdminOrUser,
  async (req, res) => {
    try {
      const districtId = parseInt(req.params.districtId);
      const data = await getMunicipalitiesByDistrictId(districtId);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

/**
 * GET /municipalities/by-constituency/:constituencyId
 */
municipalityRouter.get(
  "/by-constituency/:constituencyId",
  authenticateToken,
  authorizeAdminOrUser,
  async (req, res) => {
    try {
      const constituencyId = parseInt(req.params.constituencyId);
      const data = await getMunicipalitiesByConstituencyId(constituencyId);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

/**
 * GET /municipalities/count
 */
municipalityRouter.get(
  "/count",
  authenticateToken,
  authorizeAdminOrUser,
  async (req, res) => {
    try {
      const count = await countMunicipalities();
      res.json({ count });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch count" });
    }
  }
);

export default municipalityRouter;
