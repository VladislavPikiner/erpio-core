import { Controller, Post, Body, Get, UseGuards, UnauthorizedException, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { CreateUserSchema } from '../users/users.schema';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: any) {
    const { username, password } = body;
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @Post('register')
  @UsePipes(new ZodValidationPipe(CreateUserSchema)) // Валидируем данные через Zod
  async register(@Body() body: any) {
    console.log('Registering validated user:', body.username);
    return { message: 'User registered successfully' };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile() {
    return { message: 'Welcome to your profile!' };
  }

  @Get('admin-only')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async getAdminOnly() {
    return { message: 'Welcome, Admin!' };
  }
}
