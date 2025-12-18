import jwt from "jsonwebtoken";
import config from "../utils/config.js";

async function verifyToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Token not found." });

  try {
    const decoded = jwt.verify(token, config.SECRET);
  
    if (!decoded.user_id) {
      res.clearCookie("token", { sameSite: "strict", httpOnly: true });
      return res.status(401).json({ message: "Invalid token: missing id" });
    }

    req.user = {
      id: decoded.user_id,
      name: decoded.name,
      role: decoded.role,
      email: decoded.email,
    };

    next();
  } catch (error) {
    res.clearCookie("token", { sameSite: "strict", httpOnly: true });
    return res.status(401).json({ message: "Invalid or Expired Token." });
  }
}

export default verifyToken;
