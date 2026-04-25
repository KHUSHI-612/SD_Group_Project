import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../../shared/error/AppError.js';
import jwt from 'jsonwebtoken';
import type { JwtPayload } from 'jsonwebtoken';
import { config } from '../../config/env.config.js';
import type { IUserRepository } from '../../core/interfaces/IUserRepository.js';
import { RepositoryFactory } from '../../infrastructure/factories/Repository.factory.js';
import DatabaseClient from "../../infrastructure/database/prisma.client.js";
import type { StationMemberRole } from "@prisma/client";

export class AuthMiddleware {
  private userRepository: IUserRepository;

  constructor () {
    this.userRepository = RepositoryFactory.getUserRepository()
  }

  authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
      // console.log(req.cookies);
      if (!token) {
        throw new AppError("Invalid credentials", 401);
      }
      
      const decodedToken = jwt.verify(token, config.jwt.secret) as JwtPayload;
      const user = await this.userRepository.findById(decodedToken.user_id);
    // console.log("Decoded token:", decodedToken);
    // console.log("Authenticated user:", user);

      if (!user) {
        throw new AppError("Unauthorized", 401);
      }

      req.user = user;

      next();
    } catch (error) {
      throw new AppError("Invalid Access Token", 401);
    }
  }

  verifySuperAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const user = req?.user;
    const roles = await this.userRepository.getUserRole(user?.user_id!)
    if(roles.includes("SUPERADMIN")) {
      next()
    }
    else {
      throw new AppError("Only accessible for SuperAdmin", 401)
    }
  }

  verifyStationRole = (allowedRoles: StationMemberRole[]) => {
    return async (req: Request, _res: Response, next: NextFunction) => {
      try {
        if (!req.user || !req.user.user_id) {
          throw new AppError("Unauthorized", 401);
        }

        const station_id = req.params.station_id || req.params.id;

        if (!station_id) {
          throw new AppError("Station ID is required for role verification", 400);
        }

        const prisma = DatabaseClient.getInstance();
        const membership = await prisma.stationMember.findFirst({
          where: {
            station_id: station_id as string,
            user_id: req.user.user_id,
          },
        });

        if (!membership || !allowedRoles.includes(membership.role as any)) {
          throw new AppError("Forbidden: Insufficient privileges for this station", 403);
        }

        req.stationMemberRole = membership.role as any;
        next();
      } catch (error) {
        next(error);
      }
    };
  };
}