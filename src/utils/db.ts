import knex from "knex";
import knexConfig from "@/config/knexfile";

const environment = process.env.NODE_ENV || "development";
const configOptions = knexConfig[environment];

const db = knex(configOptions);

export default db;
