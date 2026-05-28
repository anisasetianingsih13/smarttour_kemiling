import { Controller, Post, Body, UnauthorizedException, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: any) {
    const user = await this.authService.validateUser(body.username, body.password);
    if (!user) {
      throw new UnauthorizedException({
        success: false,
        message: 'Username atau password salah.',
        metadata: {
          status: HttpStatus.UNAUTHORIZED,
        },
      });
    }
    return this.authService.login(user);
  }
}
