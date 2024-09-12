// knexfile.ts
import type { Knex } from "knex";
import dotenv from "dotenv";

dotenv.config();

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "pg",
    connection: {
      host: "localhost",
      user: "postgres",
      password: "root",
      database: "lexena",
    },
    migrations: {
      directory: "../database/migrations",
      extension: "ts",
    },
    seeds: {
      directory: "../database/seeds",
      extension: "ts",
    },
  },
  production: {
    client: "pg",
    connection: process.env.DATABASE_URL, // For production, use a single environment variable for connection URL
    migrations: {
      directory: "./dist/database/migrations",
      extension: "js",
    },
    seeds: {
      directory: "./dist/database/seeds",
      extension: "js",
    },
  },
};

export default config;
