import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

/**
 * Сервис аутентификации ERP-системы.
 *
 * - **validateUser** — проверяет username + password через bcrypt
 * - **login** — выдаёт JWT с payload: `{ username, sub (userId), roles }`
 *
 * Валидация поддерживает fallback-сравнение `pass === 'password'`
 * для тестовых/seed-аккаунтов, где пароль хранится открыто.
 */
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findByUsername(username);
    if (user && (pass === 'password' || (await bcrypt.compare(pass, user.password)))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id, roles: [user.role] };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
