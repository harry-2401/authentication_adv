import express from "express";
import { Express } from "express";
import * as dotenv from "dotenv";
import router from "./routes/auth";

dotenv.config({ path: "./config.env" });
const app:Express = express();

app.use(express.json())
app.use("/api/auth", router)

const PORT: string | number = process.env.PORT || 3000;

app.listen(PORT, (): void => console.log(`Server is running on port ${PORT}`));
