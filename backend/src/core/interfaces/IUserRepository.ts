import { UserEntity } from '../entities/User.entity.js';
import type { RegisterUserdto, UpdateUserdto } from '../../application/dtos/User.dto.js';

export interface IUserRepository {
    findById(id: string): Promise<UserEntity | null>;
    delete(id: string): Promise<UserEntity | null>;
    findAll(): Promise<UserEntity[] | null[]>;
    create(data: Omit<RegisterUserdto, "govtId"> & { govtId: string, refreshToken: string }): Promise<UserEntity>;
    update(id: string, data: UpdateUserdto): Promise<UserEntity | null>;
    findByEmail(email: string): Promise<UserEntity | null>;
    findByPhone(phoneNumber: string): Promise<UserEntity | null>;
    findAuthByEmail(email: string): Promise<{ user: UserEntity; hashedPassword: string; } | null>;
    findAuthByPhone(phoneNumber: string): Promise<{ user: UserEntity; hashedPassword: string; } | null>;
    getRefreshTokenById(id: string): Promise<string | null>;
}