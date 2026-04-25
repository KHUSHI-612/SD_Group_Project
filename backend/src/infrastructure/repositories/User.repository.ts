import type { IUserRepository } from "../../core/interfaces/IUserRepository.js";
import DatabaseClient from "../database/prisma.client.js";
import { UserEntity } from "../../core/entities/User.entity.js";
import type { UserRole } from "../../core/entities/User.entity.js";
import type {
  RegisterUserdto,
  UpdateUserdto,
} from "../../application/dtos/User.dto.js";
import { Role } from "@prisma/client";
import type { DBTransactionClient } from "../../shared/types/prisma/index.js";

export class UserRepository implements IUserRepository {
  private prisma = DatabaseClient.getInstance();

  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        user_id: id,
      },
    });
    if (user) {
      return new UserEntity(
        user.user_id,
        user.first_name,
        user?.last_name,
        user?.phone_number,
        user?.email,
        user?.address,
        user.govt_id,
        user.createdAt,
        user.updatedAt,
        user.isDeleted
      );
    } else {
      return null;
    }
  }

  async delete(id: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.update({
      where: {
        user_id: id,
      },
      data: {
        isDeleted: true
      }
    });
    if (user) {
      return new UserEntity(
        user.user_id,
        user.first_name,
        user?.last_name,
        user?.email,
        user?.phone_number,
        user?.address,
        user.govt_id,
        user.createdAt,
        user.updatedAt,
        user.isDeleted
      );
    } else {
      return null;
    }
  }

  async findAll(): Promise<UserEntity[] | null[]> {
    const users = await this.prisma.user.findMany();
    return users.map((user) => {
      return new UserEntity(
        user.user_id,
        user.first_name,
        user?.last_name,
        user?.email,
        user?.phone_number,
        user?.address,
        user.govt_id,
        user.createdAt,
        user.updatedAt,
        user.isDeleted
      );
    });
  }

  async create(
    data: Omit<RegisterUserdto, "govt_id"> & {
      govt_id: string;
      refreshToken: string;
    },
  ): Promise<UserEntity> {
    const user = await this.prisma.$transaction(async (prisma) => {
    const newUser = await prisma.user.create({
      data: {
        user_id: crypto.randomUUID(),
        first_name: data.first_name,
        last_name: data.last_name ?? null,
        email: data.email ?? null,
        password: data.password,
        phone_number: data.phone_number ?? null,
        address: data.address ?? null,
        govt_id: data.govt_id,
        refreshToken: data.refreshToken,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    await this.assignRole(newUser.user_id, Role.CUSTOMER); // Assign default role
    return newUser;
  });
    return new UserEntity(
      user.user_id,
      user.first_name,
      user?.last_name,
      user?.email,
      user?.phone_number,
      user?.address,
      user.govt_id,
      user.createdAt,
      user.updatedAt,
      user.isDeleted
    );
  }

  async update(
    id: string,
    data: Omit<UpdateUserdto, "govt_id"> | { govt_id: string },
  ): Promise<UserEntity | null> {
    // console.log("Updating user with ID:", id, "and data:", data);
    // const existingUser = await this.prisma.user.findUnique({
    //   where: {
    //     user_id: id,
    //   },
    // });
    const user = await this.prisma.user.update({
      where: {
        user_id: id,
      },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });

    if (user) {
      return new UserEntity(
        user.user_id,
        user.first_name,
        user?.last_name,
        user?.phone_number,
        user?.email,
        user?.address,
        user.govt_id,
        user.createdAt,
        user.updatedAt,
        user.isDeleted
      );
    } else {
      return null;
    }
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (user) {
      return new UserEntity(
        user.user_id,
        user.first_name,
        user?.last_name,
        user?.email,
        user?.phone_number,
        user?.address,
        user.govt_id,
        user.createdAt,
        user.updatedAt,
        user.isDeleted
      );
    } else {
      return null;
    }
  }

  async findByPhone(phoneNumber: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        phone_number: phoneNumber,
      },
    });
    if (user) {
      return new UserEntity(
        user.user_id,
        user.first_name,
        user?.last_name,
        user?.email,
        user?.phone_number,
        user?.address,
        user.govt_id,
        user.createdAt,
        user.updatedAt,
        user.isDeleted
      );
    } else {
      return null;
    }
  }

  async findAuthByEmail(
    email: string,
  ): Promise<{ user: UserEntity; hashedPassword: string } | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (user) {
      return {
        user: new UserEntity(
          user.user_id,
          user.first_name,
          user?.last_name,
          user?.email,
          user?.phone_number,
          user?.address,
          user.govt_id,
          user.createdAt,
          user.updatedAt,
          user.isDeleted
        ),
        hashedPassword: user.password,
      };
    } else {
      return null;
    }
  }

  async findAuthByPhone(
    phoneNumber: string,
  ): Promise<{ user: UserEntity; hashedPassword: string } | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        phone_number: phoneNumber,
      },
    });
    if (user) {
      return {
        user: new UserEntity(
          user.user_id,
          user.first_name,
          user?.last_name,
          user?.email,
          user?.phone_number,
          user?.address,
          user.govt_id,
          user.createdAt,
          user.updatedAt,
          user.isDeleted
        ),
        hashedPassword: user.password,
      };
    } else {
      return null;
    }
  }

  async getRefreshTokenById(id: string): Promise<string | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        user_id: id,
      },
      select: {
        refreshToken: true,
      },
    });
    return user?.refreshToken ?? null;
  }

  async assignRole(user_id: string, role: Role, tx?: DBTransactionClient): Promise<UserRole | null> {
    const client = tx || this.prisma;
    const userRole = await client.userRole.create({
      data: {
        user_id,
        role,
      },
    });

    return {
      user_id: userRole.user_id,
      role: userRole.role,
    }
  }

  async getUserRole(user_id: string, tx?: DBTransactionClient): Promise<Role[]> {
      const client = tx || this.prisma;
      const userRoles = await client.userRole.findMany({
        where: {
          user_id
        }
      })
      return userRoles.map((userRole: { role: Role }) => userRole.role)
  }
}
