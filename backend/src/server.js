import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
dotenv.config();

const PORT = process.env.PORT;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
};

startServer();