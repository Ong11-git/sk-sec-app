// src/pdf/pdfRoute.js
import express from "express";
import multer from "multer";
import { authenticateToken, authorizeAdmin } from "../middlewares/authMiddleware.js";
import { convertPdfToJson } from "./pdfService.js";
import prisma from "../../prisma/prisma.js";

const pdfRouter = express.Router();

// Store file in memory — NO DISK STORAGE
const storage = multer.memoryStorage();
const upload = multer({ storage });

pdfRouter.post(
  "/upload-pdf",
  authenticateToken,
  authorizeAdmin,
  upload.single("electoral-roll"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded." });
      }

      const { 
        districtId, 
        constituencyId,
        tcId,   
        gpuId,  
        wardId, 
        municipalityId,  
        municipalWardId,
      } = req.body;

      if (!districtId || !constituencyId) {
        return res.status(400).json({
          error: "districtId and constituencyId are required."
        });
      }

      // Convert PDF to JSON (from memory buffer)
      const jsonData = await convertPdfToJson(req.file.buffer);

      const savedVoters = [];
      const duplicateEpicNumbers = [];
      const duplicateDetails = [];

      for (const voter of jsonData) {

        // avoid processing invalid EPIC
        if (!voter.epic_no) continue;

        const existing = await prisma.voter.findFirst({
          where: { epicNo: voter.epic_no },
        });

        if (existing) {
          duplicateEpicNumbers.push(voter.epic_no);
          duplicateDetails.push({
            epicNo: voter.epic_no,
            name: voter.name,
            message: "Already exists"
          });
          continue;
        }

        // Insert only if not duplicate
        const saved = await prisma.voter.create({
          data: {
            epicNo: voter.epic_no,
            name: voter.name,
            relationType: voter.relation_type || null,
            relationName: voter.relation_name || null,
            age: voter.age ? Number(voter.age) : null,
            gender: voter.gender || null,
            country: voter.country || null,
            state: voter.state || null,
            districtId: Number(districtId),
            constituencyId: Number(constituencyId),
            tcId: Number(tcId),
            gpuId: Number(gpuId),
            wardId: Number(wardId),
            municipalityId: Number(municipalityId),
            municipalWardId: Number(municipalWardId)
          }
        });

        savedVoters.push(saved);
      }

      return res.status(200).json({
        message: "PDF processed successfully — duplicates skipped.",
        insertedCount: savedVoters.length,
        duplicateCount: duplicateEpicNumbers.length,
        duplicateEpicNumbers,   // <--- ONLY EPIC NUMBERS (AS REQUESTED)
        duplicateDetails,       // <--- Optional (UI can display table)
      });

    } catch (error) {
      console.error("Error processing PDF:", error.message);
      return res.status(500).json({ error: error.message });
    }
  }
);


export default pdfRouter;
