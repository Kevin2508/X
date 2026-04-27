import  express, { Application } from "express";
const app:Application = express();
import "dotenv/config";
import db from "./config/database";
import authRoutes from "./routes/authRoutes";
import { Request, Response } from "express";
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRoutes);
db;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript + Express!');
});
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
