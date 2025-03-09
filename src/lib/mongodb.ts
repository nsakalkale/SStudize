import mongoose from "mongoose";

const MONGO_URI =
  "mongodb+srv://sakalkalenimish2004:nimishsakal@sstudize.5jggx.mongodb.net/sstudize?retryWrites=true&w=majority&appName=Sstudize";

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    console.log("MongoDB already connected");
    return;
  }

  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as mongoose.ConnectOptions);
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    throw new Error("Database connection failed");
  }
};

export default connectDB;
