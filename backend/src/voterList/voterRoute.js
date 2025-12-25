import express from "express";
import {
  authenticateToken,
  authorizeAdminOrUser,
} from "../middlewares/authMiddleware.js";
import uploadVoterPhoto from "../middlewares/uploadVoterPhoto.js";
import {
  getAllVoters,
  getVotersCount,
  getAverageVoterAge,
  getDistrictWiseVoterCount,
  getAgeGroupDistribution,
  getGenderDistribution,
  getConstituencyWiseVoterCount,
  getVoterLastNames,
  getVotersByConstituency,
  getVotersByDistrict,
  getVotersByTc,
  getVotersByGpu,
  getVoterById,
  createVoter,
  updateVoter,
  deleteVoter,
  permanentlyDeleteVoter,
} from "./voterServices.js";
import uploadTempPhoto from "../middlewares/uploadTempPhoto.js";
import cloudinary from "../config/cloudinary.js";
import prisma from "../../prisma/prisma.js";

const voterRouter = express.Router();

voterRouter.get(
  "/",
  authenticateToken,
  authorizeAdminOrUser,
  async (req, res) => {
    try {
      const voters = await getAllVoters();
      res.json(voters);
    } catch (error) {
      console.error("Error fetching Voters", error.message);
      res.status(500).json({ error: "Failed to fetch voters." });
    }
  }
);

voterRouter.get(
  "/count",
  authenticateToken,
  authorizeAdminOrUser,
  async (req, res) => {
    try {
      const count = await getVotersCount();
      res.json({ totalVoters: count });
    } catch (error) {
      console.error("Error fetching voter count", error.message);
      res.status(500).json({ error: "Failed to fetch voter count." });
    }
  }
);

// ✅ New: Get average voter age
voterRouter.get(
  "/average-age",
  authenticateToken,
  authorizeAdminOrUser,
  async (req, res) => {
    try {
      const avgAge = await getAverageVoterAge();
      res.json({ averageAge: avgAge });
    } catch (error) {
      console.error("Error fetching average voter age", error.message);
      res.status(500).json({ error: "Failed to fetch average voter age." });
    }
  }
);

// ✅ New: District-wise voter count
voterRouter.get(
  "/district-wise-count",
  authenticateToken,
  authorizeAdminOrUser,
  async (req, res) => {
    try {
      const districtCounts = await getDistrictWiseVoterCount();
      res.json(districtCounts);
    } catch (error) {
      console.error("Error fetching district-wise voter count", error.message);
      res
        .status(500)
        .json({ error: "Failed to fetch district-wise voter count." });
    }
  }
);

// ✅ Get Age Group Distribution
voterRouter.get(
  "/age-group",
  authenticateToken,
  authorizeAdminOrUser,
  async (req, res) => {
    try {
      const data = await getAgeGroupDistribution();
      res.json(data);
    } catch (error) {
      console.error("Error fetching age group distribution", error.message);
      res
        .status(500)
        .json({ error: "Failed to fetch age group distribution." });
    }
  }
);

// Gender distribution route
voterRouter.get(
  "/gender-distribution",
  authenticateToken,
  authorizeAdminOrUser,
  async (req, res) => {
    try {
      const data = await getGenderDistribution();
      res.json(data);
    } catch (error) {
      console.error("Error fetching gender distribution", error.message);
      res.status(500).json({ error: "Failed to fetch gender distribution." });
    }
  }
);

voterRouter.get(
  "/constituency-voters",
  authenticateToken,
  authorizeAdminOrUser,
  async (req, res) => {
    try {
      const data = await getConstituencyWiseVoterCount();
      res.json(data);
    } catch (error) {
      console.error("Error fetching constituency voter count", error.message);
      res
        .status(500)
        .json({ error: "Failed to fetch constituency voter count." });
    }
  }
);

voterRouter.get(
  "/last-names",
  authenticateToken,
  authorizeAdminOrUser,
  async (req, res) => {
    try {
      const lastNames = await getVoterLastNames();
      res.json(lastNames);
    } catch (error) {
      console.error("Error fetching voter last names", error.message);
      res.status(500).json({ error: "Failed to fetch voter last names." });
    }
  }
);

// ✅ GET /voters/by-constituency/:name
voterRouter.get(
  "/by-constituency/:name",
  authenticateToken,
  authorizeAdminOrUser,
  async (req, res) => {
    try {
      const { name } = req.params;
      const stats = await getVotersByConstituency(name);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching constituency voters:", error.message);
      res.status(500).json({ error: "Failed to fetch constituency voters." });
    }
  }
);

// ✅ GET /voters/by-district/:name
voterRouter.get(
  "/by-district/:name",
  authenticateToken,
  authorizeAdminOrUser,
  async (req, res) => {
    try {
      const { name } = req.params;
      const stats = await getVotersByDistrict(name);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching district voters:", error.message);
      res.status(500).json({ error: "Failed to fetch district voters." });
    }
  }
);

// ✅ GET /voters/by-tc/:name
voterRouter.get(
  "/by-tc/:name",
  authenticateToken,
  authorizeAdminOrUser,
  async (req, res) => {
    try {
      const { name } = req.params;
      const stats = await getVotersByTc(name);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching TC voters:", error.message);
      res.status(500).json({ error: "Failed to fetch TC voters." });
    }
  }
);

// ✅ GET /voters/by-gpu/:name
voterRouter.get(
  "/by-gpu/:name",
  authenticateToken,
  authorizeAdminOrUser,
  async (req, res) => {
    try {
      const { name } = req.params;
      const stats = await getVotersByGpu(name);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching GPU voters:", error.message);
      res.status(500).json({ error: "Failed to fetch GPU voters." });
    }
  }
);

// New added routes are from the following line

/**
 * GET /voters/:id
 */
voterRouter.get(
  "/:id",
  authenticateToken,
  authorizeAdminOrUser,
  async (req, res) => {
    try {
      const voter = await getVoterById(req.params.id);
      res.json({ voter });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
);

/**
 * POST /voters/create
 */

voterRouter.post(
  "/create",
  authenticateToken,
  authorizeAdminOrUser,
  uploadTempPhoto.single("photo"),
  async (req, res) => {
    let uploadedImage = null;
    let updatedVoter = null;

    try {
      // STEP 1: Validate & create voter WITHOUT photo
      const voter = await createVoter({
        ...req.body,
        photo: null,
        photoPublicId: null,
      });

      // STEP 2: Upload photo ONLY if voter is created
      if (req.file) {
        const epicNoSafe = req.body.epicNo.replace(/[^a-zA-Z0-9_-]/g, "");

        uploadedImage = await cloudinary.uploader.upload(
          `data:${req.file.mimetype};base64,${req.file.buffer.toString(
            "base64"
          )}`,
          {
            folder: "voters",
            public_id: `voter_${epicNoSafe}_${Date.now()}`,
          }
        );

        // STEP 3: Update voter with photo info
        updatedVoter = await prisma.voter.update({
          where: { id: voter.id },
          data: {
            photo: uploadedImage.secure_url,
            photoPublicId: uploadedImage.public_id,
          },
        });
      }

      res.status(201).json({
        message: "Voter created successfully",
        voter: updatedVoter,
      });
    } catch (error) {
      // SAFETY: cleanup if upload happened but DB failed later
      if (uploadedImage?.public_id) {
        await cloudinary.uploader.destroy(uploadedImage.public_id);
      }

      console.error("Error creating voter:", error.message);
      res.status(400).json({ error: error.message });
    }
  }
);

// voterRouter.post(
//   "/create",
//   authenticateToken,
//   authorizeAdminOrUser,
//   uploadVoterPhoto.single("photo"),
//   async (req, res) => {
//     try {
//       const photo = req.file?.path || null; // URL
//       const photoPublicId = req.file?.filename || null; // Cloudinary public_id
//       const voter = await createVoter({
//         ...req.body,
//         photo,
//         photoPublicId,
//       });

//       res.status(201).json({
//         message: "Voter created successfully",
//         voter,
//       });
//     } catch (error) {
//       console.error("Error creating voter:", error.message);
//       res.status(400).json({ error: error.message });
//     }
//   }
// );

/**
 * PUT /voters/edit/:id
 */

voterRouter.put(
  "/edit/:id",
  authenticateToken,
  authorizeAdminOrUser,
  uploadTempPhoto.single("photo"),
  async (req, res) => {
    let uploadedImage = null;

    try {
      // STEP 1: Update voter WITHOUT photo
      const voter = await updateVoter(req.params.id, {
        ...req.body,
        photo: undefined,
        photoPublicId: undefined,
      });

      // STEP 2: Upload photo ONLY if provided
      if (req.file) {
        const epicNoSafe = voter.epicNo.replace(/[^a-zA-Z0-9_-]/g, "");

        uploadedImage = await cloudinary.uploader.upload(
          `data:${req.file.mimetype};base64,${req.file.buffer.toString(
            "base64"
          )}`,
          {
            folder: "voters",
            public_id: `voter_${epicNoSafe}_${Date.now()}`,
          }
        );

        // STEP 3: Delete old photo if exists
        if (voter.photoPublicId) {
          await cloudinary.uploader.destroy(voter.photoPublicId);
        }

        // STEP 4: Update voter with new photo
        const updatedVoter = await prisma.voter.update({
          where: { id: voter.id },
          data: {
            photo: uploadedImage.secure_url,
            photoPublicId: uploadedImage.public_id,
          },
        });

        return res.json({
          message: "Voter updated successfully",
          voter: updatedVoter,
        });
      }

      // No photo update
      res.json({
        message: "Voter updated successfully",
        voter,
      });
    } catch (error) {
      // Cleanup if upload succeeded but DB failed later
      if (uploadedImage?.public_id) {
        await cloudinary.uploader.destroy(uploadedImage.public_id);
      }

      console.error("Error updating voter:", error.message);
      res.status(400).json({ error: error.message });
    }
  }
);

// voterRouter.put(
//   "/edit/:id",
//   authenticateToken,
//   authorizeAdminOrUser,
//   async (req, res) => {
//     try {
//       const voter = await updateVoter(req.params.id, req.body);
//       res.json({
//         message: "Voter updated successfully",
//         voter,
//       });
//     } catch (error) {
//       console.error("Error updating voter:", error.message);
//       res.status(400).json({ error: error.message });
//     }
//   }
// );

/**
 * DELETE /voters/delete/:id
 * (soft delete)
 */
voterRouter.delete(
  "/delete/:id",
  authenticateToken,
  authorizeAdminOrUser,
  async (req, res) => {
    try {
      const voter = await deleteVoter(req.params.id);
      res.json({
        message: "Voter deleted successfully",
        voter,
      });
    } catch (error) {
      console.error("Error deleting voter:", error.message);
      res.status(400).json({ error: error.message });
    }
  }
);

/**
 * DELETE /voters/delete/:id
 * (hard delete)
 */
voterRouter.delete(
  "/permanent-delete/:id",
  authenticateToken,
  authorizeAdminOrUser,
  async (req, res) => {
    try {
      const voter = await permanentlyDeleteVoter(req.params.id);

      res.json({
        message: "Voter permanently deleted successfully",
        voter,
      });
    } catch (error) {
      console.error("Error permanently deleting voter:", error.message);
      res.status(400).json({ error: error.message });
    }
  }
);

export default voterRouter;
