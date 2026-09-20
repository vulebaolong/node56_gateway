import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service.js';
import { TokenModule } from 'src/modules-system/token/token.module';
import { TotpModule } from '../totp/totp.module';

@Module({
  imports: [TokenModule, TotpModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
