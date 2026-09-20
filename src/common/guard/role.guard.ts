import { TokenService } from '../../modules-system/token/token.service';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { PrismaService } from 'src/modules-system/prisma/prisma.service';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { ROLE_KEY } from '../decorators/role.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private prisma: PrismaService,
    private tokenService: TokenService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const role = this.reflector.getAllAndOverride<string>(ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    //tìm ra user gọi api, thông qua protect guard
    //khi có user -> lấy role trong user (role trong db)
    //role của user (db) === role (decorator)
    // nếu bằng -> đi vào Controller
    // nếu không bằng -> throw exception
    // console.log('roleGuard', { role });

    return true;
  }
}
