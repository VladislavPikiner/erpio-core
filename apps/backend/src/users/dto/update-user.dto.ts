import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsEmail, IsOptional, IsArray, IsEnum } from 'class-validator';
import { UserRole } from '@prisma/client';

@InputType()
export class UpdateUserDto {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  username?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  password?: string;

  @Field({ nullable: true })
  @IsEmail()
  @IsOptional()
  email?: string;

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsEnum(UserRole, { each: true })
  @IsOptional()
  roles?: UserRole[];

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  branchId?: string;

  @Field({ nullable: true })
  @IsOptional()
  isActive?: boolean;
}
