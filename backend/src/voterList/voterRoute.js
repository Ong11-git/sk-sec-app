import express from "express";
import { authenticateToken, 
          authorizeAdminOrUser 
        } from "../middlewares/authMiddleware.js";
import { getAllVoters, 
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
        getVotersByGpu 
    } from "./voterServices.js";

const voterRouter = express.Router();

voterRouter.get(
    "/",
    authenticateToken,
    authorizeAdminOrUser,
    async(req, res) =>{
        try {
            const voters = await getAllVoters();
            res.json(voters);
        } catch (error) {
            console.error("Error fetching Voters", error.message);
            res.status(500).json({ error: "Failed to fetch voters." });
        }
})

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
    res.status(500).json({ error: "Failed to fetch district-wise voter count." });
  }
});


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
    res.status(500).json({ error: "Failed to fetch age group distribution." });
  }
});

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
      res.status(500).json({ error: "Failed to fetch constituency voter count." });
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


export default voterRouter;