import { TokenService } from '../../modules-system/token/token.service';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { PrismaService } from 'src/modules-system/prisma/prisma.service';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';

@Injectable()
export class ProtectGuard implements CanActivate {
  constructor(
    private prisma: PrismaService,
    private tokenService: TokenService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const isPublic = this.reflector.getAllAndOverride<boolean>(
        IS_PUBLIC_KEY,
        [context.getHandler(), context.getClass()],
      );
      if (isPublic) {
        // 💡 See this condition
        return true;
      }

      const req = context.switchToHttp().getRequest();

      const { accessToken } = req.cookies;

      if (!accessToken) {
        throw new BadRequestException('không có accessToken');
      }

      //verify accessToken
      const decode = this.tokenService.verifyAccessToken(accessToken);

      const userExits = await this.prisma.users.findUnique({
        where: {
          id: (decode as any).userId,
        },
      });

      if (!userExits) {
        throw new BadRequestException('User không tồn tại');
      }

      //xử lý phân quyền role nếu có (db) -> phát triển thêm

      req.user = userExits;

      return true;
    } catch (error) {
      if (error instanceof Error) {
        switch (error.constructor) {
          case TokenExpiredError:
            throw new ForbiddenException(error.message);
          case JsonWebTokenError:
            throw new UnauthorizedException(error.message);

          default:
            throw new UnauthorizedException(error.message);
        }
      }
      throw new UnauthorizedException('Lỗi không xác định');
    }
  }
}
