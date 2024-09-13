
import redisClient from "@/config/redis";
import jwt from "jsonwebtoken";

/**
 * Create an email activation token
 * @param {number} userId - ID of the user
 * @returns {Promise<string>} - Activation token
 */
export const createEmailActivationToken = async (
  userId: number,
): Promise<string> => {
  const token = jwt.sign(
    { userId },
    process.env.JWT_SECRET || "somesecretemailtoken32",
    {
      expiresIn: "3d",
    },
  );
  await redisClient.set(`activation:${userId}`, token, {
    EX: 60 * 60 * 24 * 3, // 3 days expiration
  });
  return token;
};

/**
 * Generate an activation URL
 * @param {string} token - Activation token
 * @returns {string} - Activation URL
 */
export const generateActivationUrl = (token: string): string => {
  const baseUrl = process.env.BASE_URL || "http://localhost:5173";
  return `${baseUrl}/activate?token=${token}`;
};

/**
 * Get the stored activation token from Redis
 * @param {string} id - User ID
 * @returns {Promise<string | null>} - Stored token
 */
export const getStoredToken = async (id: string): Promise<string | null> =>
  await redisClient.get(`activation:${id}`);

/**
 * Remove the stored token from Redis
 * @param {string} id - User ID
 * @returns {Promise<number>} - The number of keys removed
 */
export const removeStoredToken = async (id: string): Promise<number> =>
  await redisClient.del(`activation:${id}`);
