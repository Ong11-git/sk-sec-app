import express from "express";
import { authenticateToken, authorizeAdminOrUser } from "../middlewares/authMiddleware.js";
import { getAllTCs, createTC,updateTC,deleteTC,getTCsByConstituency } from "./tcService.js";
const tcRouter = express.Router();

// ✅ GET /
tcRouter.get(
  "/",
  authenticateToken,
  authorizeAdminOrUser,
  async (req, res) => {
    try {
      const tcs = await getAllTCs();
      res.json(tcs);
    } catch (error) {
      console.error("Error fetching TCs:", error.message);
      res.status(500).json({ error: "Failed to fetch TCs." });
    }
  }
);

tcRouter.post(
  "/create",
  authenticateToken,
  authorizeAdminOrUser,
  async (req, res) => {
    try {
      const { tc_no, tc_name, constituencyId } = req.body;

      if (!tc_no || !tc_name || !constituencyId) {
        return res.status(400).json({ error: "tc_no, tc_name, and constituencyId are required." });
      }

      const newTC = await createTC({ tc_no, tc_name, constituencyId });
      res.status(201).json(newTC);
    } catch (error) {
      console.error("Error creating TC:", error.message);
      res.status(500).json({ error: error.message || "Failed to create TC." });
    }
  }
)

// ✅ PUT /tcs/:id
tcRouter.put(
  "/edit/:id",
  authenticateToken,
  authorizeAdminOrUser,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { tc_no, tc_name, constituencyId } = req.body;

      if (!tc_no || !tc_name || !constituencyId) {
        return res
          .status(400)
          .json({ error: "tc_no, tc_name, and constituencyId are required." });
      }

      const updatedTC = await updateTC(Number(id), {
        tc_no,
        tc_name,
        constituencyId,
      });

      res.json(updatedTC);
    } catch (error) {
      console.error("Error updating TC:", error.message);
      res.status(500).json({ error: error.message || "Failed to update TC." });
    }
  }
);

// ✅ DELETE /tcs/:id
tcRouter.delete(
  "/delete/:id",
  authenticateToken,
  authorizeAdminOrUser,
  async (req, res) => {
    try {
      const { id } = req.params;
      await deleteTC(Number(id));
      res.json({ message: "TC deleted successfully" });
    } catch (error) {
      console.error("Error deleting TC:", error.message);
      res.status(500).json({ error: error.message || "Failed to delete TC." });
    }
  }
);

// ✅ GET /tcs/by-constituency/:constituencyId
tcRouter.get(
  "/by-constituency/:constituencyId",
  authenticateToken,
  authorizeAdminOrUser,
  async (req, res) => {
    try {
      const { constituencyId } = req.params;
      const tcs = await getTCsByConstituency(constituencyId);
      res.json(tcs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);


export default tcRouter;