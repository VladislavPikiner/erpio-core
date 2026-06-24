import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from '@prisma/client';
import { CreateUserDto, UpdateUserDto } from './user.schema';
import { hashPassword } from '../../auth/utils/password.utils';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findByUsername(username);
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async create(data: CreateUserDto): Promise<User> {
    const hashedPassword = await hashPassword(data.password);
    return this.userRepository.create({
      ...data,
      password: hashedPassword,
    });
  }

  async update(id: string, data: UpdateUserDto): Promise<User> {
    if (data.password) {
      data.password = await hashPassword(data.password);
    }
    return this.userRepository.update(id, data);
  }

  async delete(id: string): Promise<User> {
    return this.userRepository.delete(id);
  }
}
