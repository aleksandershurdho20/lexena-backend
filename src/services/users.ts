import { Request, Response } from "express";
import { ApiResponse } from "@utils/apiResponse";
import db from "@utils/db";
import { UserRegisterRequest, User } from "@/types/users";
import { comparePassword } from "@/utils/users";
import jwt from "jsonwebtoken";
export class UserService {
  public async createUser(req: Request, res: Response) {
    try {
      const userData: Partial<User> = req.body;
      const [user] = await db("users").insert(userData).returning("*");
      res.json(new ApiResponse(true, "User created successfully", user));
    } catch (error) {
      console.log(error);
      ApiResponse.handleError(res, error);
    }
  }

  public async getUsers(req: Request, res: Response) {
    try {
      const conditions: Partial<User> = req.query;
      const users = await db("users").where(conditions).select("*");
      res.json(new ApiResponse(true, "Users retrieved successfully", users));
    } catch (error) {
      console.log(error, "?");
      ApiResponse.handleError(res, error);
    }
  }

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

  public async deleteUser(req: Request, res: Response) {
    try {
      const userId: number = parseInt(req.params.id);

      await db("users").where({ id: userId }).del();
      res.json(new ApiResponse(true, "User deleted successfully"));
    } catch (error) {
      ApiResponse.handleError(res, error);
    }
  }
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
}
