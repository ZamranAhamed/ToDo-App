import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import todoRoutes from "./routes/todoRoutes.js";

dotenv.config();

const app = express();

// CORS: allows the React frontend origin to send requests to this Express API.
app.use(cors());
// Request lifecycle: parses incoming JSON bodies before routes/controllers run.
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API Running...");
});

await connectDB();

// Express routing: all todo API requests are forwarded to todoRoutes.
app.use("/api/todos", todoRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
