// src/middlewares/authMiddleware.js
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Verify JWT and attach user info to req.user
 */
export function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const user = jwt.verify(token, JWT_SECRET);
    req.user = user; // Attach user info to request
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
}

/**
 * Only allow admins
 */
export function authorizeAdmin(req, res, next) {
  if (!req.user || req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
}


/**
 * Only allow User
 */
export function authorizeUser(req, res, next) {
  if (!req.user || req.user.role !== "USER") {
    return res.status(403).json({ error: "USER access required" });
  }
  next();
}

export function authorizeAdminOrUser(req, res, next) {
  if (req.user.role === "ADMIN" || req.user.role === "USER") {
    return next();
  }
  return res.status(403).json({ error: "Access denied" });
}

