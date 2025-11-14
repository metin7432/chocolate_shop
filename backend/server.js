
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import AuthRouters from './routes/auth.route.js'
import productRouters from './routes/product.route.js'
import { connectDB } from "./lib/db.js";
dotenv.config();

const app = express();

const port = process.env.PORT || 5000;

app.use(express.json())
app.use(cookieParser())
app.use("/api/auth", AuthRouters); // "/api/auth/AuthRouters" -> /api/auth/signup seklinde adres cubuguna yazilir
app.use("/api/products", productRouters); // "/api/auth/AuthRouters" -> /api/auth/signup seklinde adres cubuguna yazilir


app.listen(port, () => {
    console.log(`Server is running on port ${port} in active`);
    connectDB()
})