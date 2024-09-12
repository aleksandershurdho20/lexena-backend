import express from "express";
import dotenv from "dotenv";
import logger from "@utils/logger";
import { readdirSync } from "fs";
import router from "./routes/users";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
// database();

app.use(express.json());
console.log(process.env.JWT_SECRET);
app.use(router);
app.get("/", (req, res) => {
  logger.info("Hello world route accessed");
  res.send("Hello, World!");
});

app.listen(port, () => {
  logger.info(`Server is running on http://localhost:${port}`);
});
