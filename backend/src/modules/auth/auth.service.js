import AuthRepository from "./auth.repository.js";
import bcrypt from "bcrypt";

class AuthService {
  async register({ name, email, password, role = "CUSTOMER" }) {
    if (!name || !email || !password) {
      const err = new Error("Name, email, and password are required.");
      err.status = 400;
      throw err;
    }

    const existing = await AuthRepository.findByEmail({ email });

    if (existing) {
      const err = new Error("Email already in use.");
      err.status = 400;
      throw err;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await AuthRepository.createUser({
      name,
      email,
      passwordHash,
      role,
    });

    const { password_hash: _ph, created_at: _dt, ...rest } = user;
    return rest;
  }

  async login({ email, password }) {
    const existing = await AuthRepository.findByEmail({ email });
    const isMatch = await bcrypt.compare(password, existing.password_hash);

    if (!isMatch) {
      const err = new Error("Wrong email or password.");
      err.status = 400;
      throw err;
    }

    const { password_hash: _ph, created_at: _dt, ...rest } = existing;

    return rest;
  }
}

export default new AuthService();
