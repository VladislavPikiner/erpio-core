import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  NotFoundException,
  ConflictException,
  BadRequestException,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  Resolver,
  Query as GraphQLQuery,
  Mutation as GraphQLMutation,
  Args,
  Int,
  Field,
  ObjectType,
} from '@nestjs/graphql';
import { UsersService } from './users.service';
import { UserType as User } from './users.type';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginatedUsersDto } from './dto/paginated-users.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthRole } from '../auth/decorators/auth-role.decorator';
import { Prisma } from '@prisma/client';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @GraphQLQuery(() => User, { nullable: true })
  async user(@Args('id', { type: () => String }) id: string): Promise<User | null> {
    try {
      return this.usersService.findOne({ id });
    } catch (error) {
      if (error instanceof NotFoundException) {
        return null;
      }
      throw error;
    }
  }

  @GraphQLQuery(() => PaginatedUsersDto)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @AuthRole('ADMIN', 'MANAGER')
  async users(
    @Args({ name: 'skip', type: () => Int, nullable: true })
    skip?: number,
    @Args({ name: 'take', type: () => Int, nullable: true })
    take?: number,
    @Args({ name: 'cursor', type: () => String, nullable: true })
    cursor?: Prisma.UserWhereUniqueInput,
    @Args({ name: 'filter', type: () => String, nullable: true })
    filter?: string,
  ): Promise<PaginatedUsersDto> {
    const whereClause: Prisma.UserWhereInput = {};
    if (filter) {
      whereClause.OR = [
        { username: { contains: filter, mode: 'insensitive' } },
        { email: { contains: filter, mode: 'insensitive' } },
      ];
    }

    return this.usersService.findAll({
      skip,
      take,
      cursor,
      where: whereClause,
      orderBy: { createdAt: Prisma.SortOrder.desc },
    });
  }

  @GraphQLMutation(() => User)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @AuthRole('ADMIN')
  async createUser(@Args('input') input: CreateUserDto): Promise<User> {
    try {
      return this.usersService.create(input);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new Error(error.message);
      } else if (error instanceof BadRequestException) {
        throw new Error(error.message);
      }
      throw error;
    }
  }

  @GraphQLMutation(() => User)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @AuthRole('ADMIN')
  async updateUser(@Args('id', { type: () => String }) id: string, @Args('input') input: UpdateUserDto): Promise<User> {
    try {
      return this.usersService.update({ where: { id }, data: input });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new Error(`User with id ${id} not found`);
      } else if (error instanceof BadRequestException) {
        throw new Error(error.message);
      } else if (error instanceof ConflictException) {
        throw new Error(error.message);
      }
      throw error;
    }
  }

  @GraphQLMutation(() => User)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @AuthRole('ADMIN')
  async deleteUser(@Args('id', { type: () => String }) id: string): Promise<User> {
    try {
      return this.usersService.remove({ id });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new Error(`User with id ${id} not found`);
      }
      throw error;
    }
  }
}
