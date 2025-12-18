import { query } from "../../utils/db.js";

class AuthRepository {
  async createUser({ name, email, passwordHash, role }) {
    const result = await query(
      `INSERT INTO users (name, password_hash, email, role)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, passwordHash, email, role]
    );

    return result.rows[0];
  }

  async findByEmail({ email }) {
    const result = await query(`SELECT * FROM users WHERE email = $1`, [email]);
    return result.rows[0] || null;
  }
}

export default new AuthRepository();
