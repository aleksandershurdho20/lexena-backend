import { Request, Response } from "express";
import { ApiResponse } from "@utils/apiResponse";
import db from "@utils/db";
import { User, UserActivationRequest } from "@/types/users";
import { comparePassword } from "@/utils/users";
import jwt from "jsonwebtoken";
import {
  createEmailActivationToken,
  generateActivationUrl,
  getStoredToken,
  removeStoredToken,
} from "@/helpers/emailActivation";
import { activationEmailContent, sendEmail } from "@/helpers/emails";
import logger from "@/utils/logger";

export class UserService {
  /**
   * Create a new user
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @param {Partial<User>} req.body - User data to be created
   */
  public async createUser(req: Request, res: Response) {
    try {
      const userData: Partial<User> = req.body;

      const [user] = await db("users").insert(userData).returning("*");
      const token = await createEmailActivationToken(user.id);
      const activationUrl = generateActivationUrl(token);
      await sendEmail({
        to: user.email,
        subject: "Aktivizoni adresen",
        html: activationEmailContent(activationUrl, userData.name as string),
      });

      logger.info(`User ${user.name} created and received email`);
      res.json(new ApiResponse(true, "User created successfully", user));
    } catch (error) {
      console.log(error);
      ApiResponse.handleError(res, error);
    }
  }
  /**
   * Get all users
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   */
  public async getUsers(req: Request, res: Response) {
    try {
      const users = await db("users").select("*");
      res.json(new ApiResponse(true, "Users retrieved successfully", users));
    } catch (error) {
      ApiResponse.handleError(res, error);
    }
  }

  /**
   * Update an existing user
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @param {number} req.params.id - ID of the user to be updated
   * @param {Partial<User>} req.body - User data to be updated
   */
  public async updateUser(req: Request, res: Response) {
    try {
      const userId: number = parseInt(req.params.id);
      const updateData: Partial<User> = req.body;

      const [updatedUser] = await db("users")
        .where({ id: userId })
        .update(updateData)
        .returning("*");
      res.json(new ApiResponse(true, "User updated successfully", updatedUser));
    } catch (error) {
      ApiResponse.handleError(res, error);
    }
  }
  /**
   * Delete a user
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @param {number} req.params.id - ID of the user to be deleted
   */
  public async deleteUser(req: Request, res: Response) {
    try {
      const userId: number = parseInt(req.params.id);

      await db("users").where({ id: userId }).del();
      res.json(new ApiResponse(true, "User deleted successfully"));
    } catch (error) {
      ApiResponse.handleError(res, error);
    }
  }

  /**
   * Login a user
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @param {string} req.body.email - Email of the user
   * @param {string} req.body.password - Password of the user
   */
  public async loginUser(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user: User[] = await db("users").where({ email }).select("*");

      if (user.length === 0) {
        return res.json(
          new ApiResponse(false, "Email or Password is incorrect!"),
        );
      }

      const matchPassword = await comparePassword(
        password,
        user[0].password as string,
      );
      if (!matchPassword) {
        return res.json(
          new ApiResponse(false, "Email or Password is incorrect!"),
        );
      }

      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        throw new Error("JWT secret is not defined");
      }

      const token = jwt.sign({ _id: user[0].id }, jwtSecret, {
        expiresIn: "7d",
      });

      user[0].password = undefined;

      res.json(
        new ApiResponse(true, "User login Successfully", {
          token,
          user: user[0],
        }),
      );
    } catch (error) {
      ApiResponse.handleError(res, error);
    }
  }

  /**
   * Users receive a email where his account it's activated and his password it's updated.
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @param {string} req.query.token - Activation token
   * @param {UserActivationRequest} req.body - User data for activation
   */
  public async activateUser(req: Request, res: Response) {
    const { token } = req.query;
    const userData: UserActivationRequest = req.body;
    logger.info(`User ${userData.id} is trying to activate`);
    try {
      if (!token) {
        return new ApiResponse(false, "Invalid activation link");
      }
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        throw new Error("JWT secret is not defined");
      }
      const decoded = jwt.verify(token as string, jwtSecret) as {
        userId: string;
      };
      const storedToken = await getStoredToken(decoded.userId);
      if (!storedToken || storedToken !== token) {
        return new ApiResponse(false, "Invalid or expired activation link");
      }
      const [activatedUser] = await db("users")
        .where({ id: decoded.userId })
        .update(userData)
        .returning("*");
      await removeStoredToken(storedToken as string);
      logger.info(`User ${userData.id} activated succesfully`);
      return res.json(
        new ApiResponse(true, "User activated successfully", activatedUser),
      );
    } catch (error) {
      ApiResponse.handleError(res, error);
    }
  }
}
