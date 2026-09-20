import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from 'src/modules-system/prisma/prisma.service';
import { TokenService } from 'src/modules-system/token/token.service';
import * as bcrypt from 'bcrypt';
import { TotpService } from '../totp/totp.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private tokenService: TokenService,
    private totpService: TotpService,
  ) {}
  async login(body: LoginDto) {
    const { email, password, token } = body;
    //kiểm tra email đã được đăng ký chưa
    const userExit = await this.prisma.users.findUnique({
      where: {
        email: email,
      },
      omit: {
        password: false, // lấy cột password ra
      },
    });
    //chưa -> yêu cầu đăng ký
    if (!userExit) {
      // throw new BadRequestException("Tài khoản không chính xác");
      throw new BadRequestException(
        'Email chưa được đăng ký. Vui lòng đăng ký tài khoản.',
      );
    }

    // if (!userExit.password) {
    //   throw new BadRequestException('Vui lòng nhập mật khẩu.');
    // }

    //kiểm tra totp
    if (userExit.totpSecret) {
      if (token) {
        //lần gọi api thứ 2
        const { valid } = await this.totpService.totp.verify(token, {
          secret: userExit.totpSecret,
        });

        if (!valid) {
          throw new BadRequestException(
            'Mã xác thực không hợp lệ. Vui lòng thử lại.',
          );
        }
      } else {
        //lần đầu tiên gọi api
        return { isTotp: true };
      }
    }

    //đã đăng ký -> xử lý logic đăng nhập
    const isPasswordValid = bcrypt.compareSync(password, userExit.password); //true

    if (!isPasswordValid) {
      // throw new BadRequestException("Tài khoản không chính xác.");
      throw new BadRequestException(
        'Mật khẩu không chính xác. Vui lòng thử lại.',
      );
    }

    const accessToken = this.tokenService.createAccessToken(userExit.id);

    const refreshToken = this.tokenService.createRefreshToken(userExit.id);
    return { accessToken: accessToken, refreshToken: refreshToken };
  }

  async refreshToken(req: Request) {
    const { accessToken, refreshToken } = req.cookies;

    if (!accessToken || !refreshToken) {
      throw new BadRequestException('Vui lòng đăng nhập để tiếp tục');
    }

    const decodeAccessToken: any = this.tokenService.verifyAccessToken(
      accessToken,
      {
        ignoreExpiration: true, //bỏ qua thời gian hết hạn
      },
    );

    const decodeRefreshToken: any =
      this.tokenService.verifyRefreshToken(refreshToken);

    if (decodeAccessToken.userId !== decodeRefreshToken.userId) {
      throw new UnauthorizedException('Token không hợp lệ');
    }

    const userExist = await this.prisma.users.findUnique({
      where: {
        id: decodeAccessToken.userId,
      },
    });

    if (!userExist) {
      throw new UnauthorizedException('Người dùng không tồn tại');
    }

    const newAccessToken = this.tokenService.createAccessToken(userExist.id);

    return {
      accessToken: newAccessToken,
      refreshToken: refreshToken,
    };
  }
}
