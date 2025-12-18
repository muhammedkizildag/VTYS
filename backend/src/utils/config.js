import dotenv from "dotenv";

dotenv.config("../../.env");

const PORT = process.env.PORT || 8080;
const SECRET = process.env.SECRET;
const DATABASE_URL = process.env.DATABASE_URL;

export default { PORT, SECRET, DATABASE_URL };
