import express from "express";
import authRouter from "./modules/auth/index.js";
import customerRouter from "./modules/customer/index.js";
import restaurantRouter from "./modules/restaurant/index.js";
import cookieParser from "cookie-parser";
import customMorgan from "./utils/morgan.js";
import cors from "cors";
const app = express();

app.use(cors(
    {
        origin: 'http://localhost:3000',
        credentials: true
    }
)); 
app.use(express.json());
app.use(cookieParser());
app.use(customMorgan)

app.use("/auth", authRouter);
app.use("/customer", customerRouter);
app.use("/restaurant", restaurantRouter);

export default app;
