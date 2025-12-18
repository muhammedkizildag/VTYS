import jwt from "jsonwebtoken";
import config from "./config.js";

function generateToken({ user_id, name, email, role }, res) {
  const token = jwt.sign({ user_id, role, name, email }, config.SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 1000 * 24 * 7,
    secure: false
  });

  return token;
}

export default generateToken;
