import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL || "127.0.0.1:6379",
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));

(async () => {
  await redisClient.connect();
})();

export default redisClient;
