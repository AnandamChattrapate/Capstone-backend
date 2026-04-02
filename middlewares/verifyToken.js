import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();

export const verifyToken = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      // read token from request cookies
      const token = req.cookies?.token;

      if (!token) {
        return res.status(401).json({ message: "Unauthorized request. Please login" });
      }

      // verify & validate token
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

      // check role permission
      if (allowedRoles.length && !allowedRoles.includes(decodedToken.role)) {
        return res.status(403).json({ message: "Forbidden permission role mismatch "+decodedToken.role+' '+allowedRoles });
      }

      // attach user data to request
      req.user = decodedToken;

      // move to next middleware
      next();

    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Session expired" });
      }

      if (err.name === "JsonWebTokenError") {
        return res.status(401).json({ message: "Invalid token" });
      }

      next(err);
    }
  };
};