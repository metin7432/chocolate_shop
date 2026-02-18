
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import AuthRouters from './routes/auth.route.js'
import productRouters from './routes/product.route.js'
import cartRouters from './routes/cart.route.js'
import couponRouters from './routes/coupon.route.js'
import paymentRouters from './routes/payment.route.js'
import analyticsRouters from './routes/analytics.route.js'
import { connectDB } from "./lib/db.js";
import  path  from "path";


dotenv.config();

const app = express();


const port = process.env.PORT || 5001;
const dirname = path.resolve()
app.use(express.json({limit: '50mb'}))
app.use(cookieParser())


app.use("/api/auth", AuthRouters); // "/api/auth/AuthRouters" -> /api/auth/signup seklinde adres cubuguna yazilir
app.use("/api/products", productRouters); // "/api/auth/AuthRouters" -> /api/auth/signup seklinde adres cubuguna yazilir
app.use("/api/cart", cartRouters);
app.use("/api/coupons", couponRouters);
app.use("/api/payments", paymentRouters);
app.use("/api/analytics", analyticsRouters);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/frontend/dist")));

    app.get("*", (req,res)=> {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
    })
}
app.listen(port, () => {
    console.log(`Server is running on port ${port} in active`);
    connectDB()
})

// this will get the id of the image