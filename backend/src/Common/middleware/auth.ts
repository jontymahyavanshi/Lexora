import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extend Request type (clean TS)
interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
}

// 🔒 PROTECT ROUTES
export const protect = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    // ❌ No token
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // ❌ Missing secret
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "JWT secret not configured" });
    }

    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
      id: string;
      role: string;
    };

    // ✅ Attach user data
    req.userId = decoded.id;
    req.userRole = decoded.role;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// 👑 ROLE-BASED AUTHORIZATION
export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.userRole) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (!roles.includes(req.userRole)) {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  };
};