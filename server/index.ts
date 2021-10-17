import express from "express";
import { Express } from "express";
import * as dotenv from "dotenv";
import router from "./routes/auth";
import connectDb from "./config/db";
import errorHandler from "./middleware/error";
//config env
dotenv.config({ path: "./config.env" });

//connect database
connectDb();

const app: Express = express();

app.use(express.json());

app.use("/api/auth", router);
//handler error middleware
app.use(errorHandler);

const PORT: string | number = process.env.PORT || 3000;

app.listen(PORT, (): void => console.log(`Server is running on port ${PORT}`));
