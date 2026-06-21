import { IsString, IsEmail, IsOptional, IsNotEmpty, IsArray, IsEnum, IsInt, Min, Max, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UserRole } from '@prisma/client';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsArray()
  @IsEnum(UserRole, { each: true })
  roles: UserRole[];

  @IsString()
  @IsOptional()
  branchId?: string;
}
