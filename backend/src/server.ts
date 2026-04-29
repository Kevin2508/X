import express, { Application } from "express";
import "dotenv/config";
import db from "./config/database";
import authRoutes from "./routes/authRoutes";
import { Request, Response } from "express";
import userRoutes from "./routes/userRoutes";
import tweetRoutes from "./routes/tweetRoutes";
import interactionRoutes from "./routes/interactionRoutes";
import followRoutes from "./routes/followRoutes";

const PORT = process.env.PORT;
const app: Application = express();

// ROUTES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRoutes);
db;
app.use("/api/users", userRoutes);
app.use("/api/tweets", tweetRoutes);
app.use("/api/interaction", interactionRoutes);
app.use("/api/comments",interactionRoutes);
app.use("/api/follows",followRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript + Express!");
});
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
