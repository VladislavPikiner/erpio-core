import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsEmail, IsOptional, IsNotEmpty, IsArray, IsEnum } from 'class-validator';
import { UserRole } from '@prisma/client';

@InputType()
export class CreateUserDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  username: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  password: string;

  @Field({ nullable: true })
  @IsEmail()
  @IsOptional()
  email?: string;

  @Field(() => [String])
  @IsArray()
  @IsEnum(UserRole, { each: true })
  roles: UserRole[];

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  branchId?: string;
}
