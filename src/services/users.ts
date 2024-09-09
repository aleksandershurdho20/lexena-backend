
import { Request, Response } from 'express';
import { ApiResponse } from '@utils/apiResponse';
import { Database } from '@utils/db';
import { UserRegisterRequest,User} from "@/types/users"

export class UserService {
  private db = Database.getInstance(); 

  public async createUser(req: Request, res: Response) {
    try {
      const userData: Partial<User> = req.body; 
      const user = await this.db.create<UserRegisterRequest>('users', userData); 
      res.json(new ApiResponse(true, 'User created successfully', user));
    } catch (error) {
      console.log(error)
      ApiResponse.handleError(res, error); 
    }
  }

  public async getUsers(req: Request, res: Response) {
    try {
       const users = await this.db.selectAll<User>('users'); 
      res.json(new ApiResponse(true, 'Users retrieved successfully', users));
    } catch (error) {
      ApiResponse.handleError(res, error); 
    }
  }

  public async updateUser(req: Request, res: Response) {
    try {
      const userId: number = parseInt(req.params.id); 
      const updateData: Partial<User> = req.body; 

      const updatedUser = await this.db.update<User>('users', updateData, { id: userId }); 
      res.json(new ApiResponse(true, 'User updated successfully', updatedUser));
    } catch (error) {
      ApiResponse.handleError(res, error); 
    }
  }

  public async deleteUser(req: Request, res: Response) {
    try {
      const userId: number = parseInt(req.params.id); 

      await this.db.delete<User>('users', { id: userId }); 
      res.json(new ApiResponse(true, 'User deleted successfully'));
    } catch (error) {
      ApiResponse.handleError(res, error); 
    }
  }
}
