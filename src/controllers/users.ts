import { Request, Response } from "express";
import { UserService } from "@/services/users";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public async createUser(req: Request, res: Response) {
    await this.userService.createUser(req, res);
  }

  public async getUsers(req: Request, res: Response) {
    await this.userService.getUsers(req, res);
  }

  public async updateUser(req: Request, res: Response) {
    await this.userService.updateUser(req, res);
  }

  public async deleteUser(req: Request, res: Response) {
    await this.userService.deleteUser(req, res);
  }
  public async login(req: Request, res: Response) {
    await this.userService.loginUser(req, res);
  }
  public async activateUser(req: Request, res: Response) {
    await this.userService.activateUser(req, res);
  }
}
