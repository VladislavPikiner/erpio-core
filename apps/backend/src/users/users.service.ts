import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { Prisma, User, UserRole } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginatedUsersDto } from './dto/paginated-users.dto';
import { hashPassword } from '../auth/utils/password.utils';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      username: createUserDto.username,
    });
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    if (createUserDto.email) {
      const existingUserByEmail = await this.usersRepository.findOne({
        email: createUserDto.email,
      });
      if (existingUserByEmail) {
        throw new ConflictException('Email already exists');
      }
    }

    const hashedPassword = await hashPassword(createUserDto.password);

    const validRoles = createUserDto.roles.map(role => UserRole[role as keyof typeof UserRole]).filter(role => role !== undefined);
    if (validRoles.length !== createUserDto.roles.length) {
      throw new BadRequestException('Invalid role provided');
    }

    const userData: Prisma.UserCreateInput = {
      username: createUserDto.username,
      password: hashedPassword,
      email: createUserDto.email,
      roles: validRoles,
      branch: createUserDto.branchId ? { connect: { id: createUserDto.branchId } } : undefined,
    };

    return this.usersRepository.create(userData);
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<PaginatedUsersDto> {
    const users = await this.usersRepository.findAll(params);
    const totalCount = await this.usersRepository.count(params.where ?? {});

    return { users, totalCount };
  }

  async findOne(where: Prisma.UserWhereUniqueInput): Promise<User> {
    const user = await this.usersRepository.findOne(where);
    if (!user) {
      throw new NotFoundException(`User with ${JSON.stringify(where)} not found`);
    }
    return user;
  }

  async update(params: {
    where: Prisma.UserWhereUniqueInput;
    data: UpdateUserDto;
  }): Promise<User> {
    const { where, data } = params;

    await this.findOne(where);

    let hashedPassword: string | undefined;
    if (data.password) {
      hashedPassword = await hashPassword(data.password);
    }

    const updateData: Prisma.UserUpdateInput = {
      ...data,
      password: hashedPassword,
      roles: data.roles ? data.roles.map(role => UserRole[role as keyof typeof UserRole]).filter(role => role !== undefined) : undefined,
      branch: data.branchId ? { connect: { id: data.branchId } } : (data.branchId === null ? { disconnect: true } : undefined),
    };

    Object.keys(updateData).forEach(key => {
      if (updateData[key as keyof Prisma.UserUpdateInput] === undefined) {
        delete updateData[key as keyof Prisma.UserUpdateInput];
      }
    });

    return this.usersRepository.update({ where, data: updateData });
  }

  async remove(where: Prisma.UserWhereUniqueInput): Promise<User> {
    await this.findOne(where);
    // FIX: Pass only the ID string as expected by UsersRepository.delete
    return this.usersRepository.delete(where.id);
  }

  private async count(where?: Prisma.UserWhereInput): Promise<number> {
    return this.usersRepository.count(where ?? {});
  }
}
