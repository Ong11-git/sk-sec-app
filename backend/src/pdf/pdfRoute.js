// src/pdf/pdfRoute.js
import express from "express";
import multer from "multer";
import { authenticateToken, authorizeAdmin } from "../middlewares/authMiddleware.js";
import { convertPdfToJson } from "./pdfService.js";
import prisma from "../../prisma/prisma.js";

const pdfRouter = express.Router();
const upload = multer({ dest: "uploads/" });

pdfRouter.post(
  "/upload-pdf",
  authenticateToken,
  authorizeAdmin,
  upload.single("electoral-roll"),
  async (req, res) => {
    console.log("Request body:", req.body);
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded." });
      }

      // Extract params from body
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
        return res
          .status(400)
          .json({ error: "districtId and constituencyId are required." });
      }

      console.log(req.file.path);

      const jsonData = await convertPdfToJson(req.file.path);

      const savedVoters = [];
      const duplicateVoters = [];

      for (const voter of jsonData) {
        // ✅ Use findFirst since epicNo is not unique
        const existing = await prisma.voter.findFirst({
          where: { epicNo: voter.epic_no },
        });

        if (existing) {
          duplicateVoters.push({
            epicNo: voter.epic_no,
            message: "Voter already exists",
          });
          continue; // skip insertion
        }

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
            gpuId:Number(gpuId),  
            wardId:Number(wardId), 
            municipalityId: Number(municipalityId),
            municipalWardId: Number(municipalWardId)
          },
        });
        savedVoters.push(saved);
      }

      res.status(201).json({
        message: "✅ PDF processed successfully!",
        insertedCount: savedVoters.length,
        duplicateCount: duplicateVoters.length,
        duplicates: duplicateVoters, // list of objects { epicNo, message }
        file: {
          originalname: req.file.originalname,
          filename: req.file.filename,
          path: req.file.path,
          mimetype: req.file.mimetype,
          size: req.file.size,
        },
        extracted: jsonData, // extracted PDF text in JSON
      });
    } catch (error) {
      console.error("Error processing pdf:", error.message);
      res.status(400).json({
        error: error.message,
      });
    }
  }
);

export default pdfRouter;
