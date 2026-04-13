import type { Request, Response, NextFunction } from "express";
import { AuthService } from "../../application/services/Auth.service.js";
import type { RegisterUserdto } from "../../application/dtos/User.dto.js";
import { AppError } from "../../shared/error/AppError.js";
import { AppResponse } from "../../shared/response/AppResponse.js";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { firstName, lastName, email, phoneNumber, address, password } =
      req.body;
    const govtId = req.file as Express.Multer.File;
    console.log("Received registration data");
    if (!email && !phoneNumber) {
      throw new AppError("Either email or phone number must be provided");
    } else if (!govtId) {
      throw new AppError("Government ID is required");
    } else if (!password || password.length < 6) {
      throw new AppError("Password must be at least 6 characters long");
    } else if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new AppError("Invalid email format");
    } else if (phoneNumber && !/^\d{10}$/.test(phoneNumber)) {
      throw new AppError("Phone number must be 10 digits");
    } else if (
      !firstName ||
      !firstName.trim().length ||
      firstName.trim().length < 3 ||
      firstName.trim().length > 50
    ) {
      throw new AppError(
        "First name is required and must be between 3 and 50 characters",
      );
    }

    const registerUserDto: RegisterUserdto = {
      firstName,
      lastName,
      email,
      phoneNumber,
      address,
      govtId,
      password,
    };

    try {
      const result = await this.authService.register(registerUserDto);

      res
        .status(201)
        .cookie("accessToken", result.tokens.accessToken, { httpOnly: true })
        .cookie("refreshToken", result.tokens.refreshToken, { httpOnly: true })
        .json(
          new AppResponse(201, result.user, "User registered successfully"),
        );
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const {email, phoneNumber, password} = req.body;

    if (!email?.trim() && !phoneNumber?.trim()) {
      throw new AppError("Either email or phone number must be provided");
    } else if (!password || password?.trim().length < 6) {
      throw new AppError("Password must be at least 6 characters long");
    }

    const loginUserDto = {
      email,
      phoneNumber,
      password
    }

    try {
      const result = await this.authService.login(loginUserDto);

      res
        .status(200)
        .cookie("accessToken", result.tokens.accessToken, { httpOnly: true })
        .cookie("refreshToken", result.tokens.refreshToken, { httpOnly: true })
        .json(
          new AppResponse(200, result.user, "User logged in successfully"),
        );
    } catch (error) {
      next(error);
    }

  }
}
