import generateToken from "../../utils/token.js";
import AuthService from "./auth.service.js";

class AuthController {
  async register(req, res) {
    try {
      const user = await AuthService.register(req.body);
      generateToken(user, res);
      return res.status(201).json(user);
    } catch (err) {
      return res.status(err.status || 500).json({ message: err.message });
    }
  }

  async login(req, res) {
    try {
      const user = await AuthService.login(req.body);
      const token = generateToken(user, res);
      console.log(res.cookies)
      return res.status(200).json(user);
    } catch (err) {
      return res.status(err.status || 500).json({ message: err.message });
    }
  }

  async logout(req, res) {
    try {
      res.clearCookie("token", { sameSite: "lax", httpOnly: true, secure: false });
      return res.status(204).json({ message: "Logout Successfully." });
    } catch (err) {
      return res.status(err.status || 500).json({ message: err.message });
    }
  }
}

export default new AuthController();
