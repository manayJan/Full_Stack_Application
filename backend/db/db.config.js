import mongoose from "mongoose";

export async function connectDB(){
     mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Atlas Connected"))
  .catch((err) => console.log("❌ Mongo Error:", err));
}