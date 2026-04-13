import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppError } from "../../shared/error/AppError.js";
import { UserRepository } from "../../infrastructure/repositories/User.repository.js";
import type { RegisterUserdto, LoginUserdto } from "../dtos/User.dto.js";
import type { IUserRepository } from "../../core/interfaces/IUserRepository.js";
import { RepositoryFactory } from "../../infrastructure/factories/Repository.factory.js";
import { CloudinaryService } from "../../shared/utils/cloudinary.util.js";
import { config } from "../../config/env.config.js";
import type { UserEntity } from "../../core/entities/User.entity.js";

export class AuthService {
  private userRepository: IUserRepository;
  private cloudinaryService: CloudinaryService;
  private readonly SALT_ROUNDS = 10;

  constructor() {
    this.userRepository =
      RepositoryFactory.getUserRepository() as IUserRepository;
    this.cloudinaryService = new CloudinaryService();
  }

  async register(registerUserDto: RegisterUserdto): Promise<{
    user: UserEntity;
    tokens: { accessToken: string; refreshToken: string };
  }> {
    console.log("Starting registration process");
    if (registerUserDto.email) {
      const emailExists = await this.userRepository.findByEmail(
        registerUserDto.email,
      );
      if (emailExists) {
        throw new AppError("Email already in use", 400);
      }
    }

    if (registerUserDto.phoneNumber) {
      const phoneExists = await this.userRepository.findByPhone(
        registerUserDto.phoneNumber,
      );
      if (phoneExists) {
        throw new AppError("Phone number already in use", 400);
      }
    }

    const govtIdURL = await this.cloudinaryService.uploadToCloudinary(
      registerUserDto.govtId.path,
      "govtId",
    );

    const hashedPassword = await bcrypt.hash(
      registerUserDto.password,
      this.SALT_ROUNDS,
    );

    const newUser = await this.userRepository.create({
      ...registerUserDto,
      password: hashedPassword,
      govtId: govtIdURL.secure_url,
      refreshToken: "", // Placeholder, will be updated after token generation
    });

    const tokens = this.generateTokens(newUser.id);

    return { user: newUser, tokens };
  }

  private generateTokens(userId: string): {
    accessToken: string;
    refreshToken: string;
  } {
    try {
      const accessToken = jwt.sign({ userId }, this.getJwtSecret(), {
        expiresIn: config.jwt.accessTokenExpiry as any,
      });
      const refreshToken = jwt.sign({ userId }, this.getJwtSecret(), {
        expiresIn: config.jwt.refreshTokenExpiry as any,
      });
      const user = this.userRepository.update(userId, { refreshToken });

      return { accessToken, refreshToken };
    } catch (error) {
      throw new AppError("Failed to generate tokens", 500);
    }
  }

  private getJwtSecret(): string {
    const secret = config.jwt.secret;

    if (!secret) {
      throw new Error("JWT_SECRET is not defined");
    }

    return secret;
  }

  async login(loginUserDto: LoginUserdto): Promise<{
    user: UserEntity;
    tokens: { accessToken: string; refreshToken: string };
  }> {
    const { email, phoneNumber, password } = loginUserDto;

    let result: { user: UserEntity; hashedPassword: string } | null = null;

    if (email) {
      result = await this.userRepository.findAuthByEmail(email);
    } else if (phoneNumber) {
      result = await this.userRepository.findAuthByPhone(phoneNumber);
    }

    if (!result) {
      throw new AppError("No user with the provided credentials", 404);
    }

    const passwordMatch = await bcrypt.compare(password, result.hashedPassword);

    if (!passwordMatch) {
      throw new AppError("Invalid credentials", 401);
    }

    const tokens = this.generateTokens(result?.user.id);

    const user = await this.userRepository.findById(result!.user.id);

    if (!user) {
      throw new AppError("User not found after authentication", 404);
    }
    return { user: user!, tokens };
  }
}
