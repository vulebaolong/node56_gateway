import { Data } from 'effect/Schema';
import { Body, Controller, Get, Post, Query, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto';
import type { Request, Response } from 'express';
import { Public } from 'src/common/decorators/public.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { Role } from 'src/common/decorators/role.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  //DTO: Data tranfer object
  @Post('login')
  @Public()
  async login(
    @Body()
    body: LoginDto,
    // @Query, @Param
    // cho phép trả về response trực tiếp mà không cần NestJS tự động gửiv
    @Res({ passthrough: true })
    res: Response,
  ) {
    const result = await this.authService.login(body);

    if (result.isTotp) {
      return { isTotp: true };
    } else {
      res.cookie('accessToken', result.accessToken);
      res.cookie('refreshToken', result.refreshToken);
    }
    return true;
  }

  @Get('get-info')
  @Role('ADMIN')
  async getInfo(@User() user) {
    if (user.totpSecret) {
      user.isTotp = true;
    }
    return user;
  }

  @Post('refresh-token')
  @Public()
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.refreshToken(req);
    res.cookie('accessToken', result.accessToken);
    res.cookie('refreshToken', result.refreshToken);
    return true;
  }
}
