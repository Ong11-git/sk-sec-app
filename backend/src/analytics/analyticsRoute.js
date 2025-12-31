import express from "express";
import { getDashboardAnalytics } from "./analyticsService.js";
import {
  authenticateToken,
  authorizeAdminOrUser,
  authorizeAdmin,
} from "../middlewares/authMiddleware.js";

const analyticsRouter = express.Router();

/**
 * GET /analytics/dashboard
 * Dashboard analytics (single API call)
 */
// analyticsRouter.get(
//   "/dashboard",
//   authenticateToken,
//   authorizeAdminOrUser,
//   async (req, res) => {
//     try {
//       const analytics = await getDashboardAnalytics();

//       res.json({
//         success: true,
//         data: analytics,
//       });
//     } catch (error) {
//       console.error("Dashboard analytics error:", error.message);
//       res.status(500).json({
//         success: false,
//         error: "Failed to fetch dashboard analytics",
//       });
//     }
//   }
// );


analyticsRouter.get(
  "/dashboard",
  authenticateToken,
  authorizeAdminOrUser,
  async (req, res) => {
    try {
      const analytics = await getDashboardAnalytics(req.query);

      res.json({
        success: true,
        data: analytics,
      });
    } catch (error) {
      console.error("Dashboard analytics error:", error.message);
      res.status(500).json({
        success: false,
        error: "Failed to fetch dashboard analytics",
      });
    }
  }
);

export default analyticsRouter;
