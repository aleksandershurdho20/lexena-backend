import { Response } from "express";

export class ApiResponse<T> {
  constructor(
    public success: boolean,
    public message: string,
    public data?: T,
    public errorCode?: number,
  ) {}

  static handleError(res: Response, error: any) {
    if (error instanceof ApiError) {
      res
        .status(error.errorCode)
        .json(
          new ApiResponse(false, error.message, undefined, error.errorCode),
        );
    } else {
      res
        .status(500)
        .json(new ApiResponse(false, "An unexpected error occurred"));
    }
  }
}

export class ApiError extends Error {
  public errorCode: number;
  public originalError?: any;

  constructor(message: string, errorCode: number = 500, originalError?: any) {
    super(message);
    this.errorCode = errorCode;
    this.originalError = originalError;
  }
}
