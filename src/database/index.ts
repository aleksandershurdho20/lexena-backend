// src/db/index.ts

import { Client } from "pg";

export const database = new Client({
  // user: process.env.DB_USER,
  // host: process.env.DB_HOST,
  // database: process.env.DB_DATABASE,
  // password: process.env.DB_PASSWORD,
  user: "postgres",
  host: "localhost",
  database: "lexena",
  password: "root",

  port: 5432,
});

const test = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
};
// console.log(test,"??")
database
  .connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch((err) => console.error("Connection error", err.stack));
