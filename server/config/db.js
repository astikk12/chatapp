import mongoose from "mongoose";
import "dotenv/config"
const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("DB Connected");
};

export default connectDB;