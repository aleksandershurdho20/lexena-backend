import logger from "@utils/logger";
import dotenv from "dotenv";
import express from "express";
import { readdirSync } from "fs";
import path from 'path';
test()
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
console.log(process.env.JWT_SECRET);
const routesPath = path.resolve(__dirname, './routes');

  readdirSync(routesPath).map((route) => {
    const routePath = path.join(routesPath, route);
    const importedRoute = require(routePath);

    // Check for default export
    const routeModule = importedRoute.default || importedRoute;
    
    app.use('/api', routeModule);
  });
function test() {
  return "test"
}

app.listen(port, () => {
  logger.info(`Server is running on http://localhost:${port}`);
});
