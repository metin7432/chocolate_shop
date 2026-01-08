import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
export const connectDB = async () => {
    try {
      const conn=   await mongoose.connect('mongodb+srv://metin7432:M7k4H1V9@node.s8vs5ab.mongodb.net/cikolata')
      console.log(`Mongodb connect ${conn.connection.host}`);
      
    } catch (error) {
        console.log(error.message);
        process.exit(1)
        
    }
}