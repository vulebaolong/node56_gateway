import { BadRequestException, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import {
  ACCESS_TOKEN_SECRET_KEY,
  REFRESH_TOKEN_SECRET_KEY,
} from 'src/common/constant/app.constant';

@Injectable()
export class TokenService {
  createAccessToken(userID) {
    if (!userID) {
      throw new BadRequestException('Không có userID để tạo access token');
    }

    const accessToken = jwt.sign({ userId: userID }, ACCESS_TOKEN_SECRET_KEY, {
      expiresIn: '1h',
    });

    return accessToken;
  }

  createRefreshToken(userID) {
    if (!userID) {
      throw new BadRequestException('Không có userID để tạo refresh token');
    }

    const refreshToken = jwt.sign(
      { userId: userID },
      REFRESH_TOKEN_SECRET_KEY,
      {
        expiresIn: '7d',
      },
    );

    return refreshToken;
  }

  verifyAccessToken(accessToken, option?: jwt.VerifyOptions) {
    const decode = jwt.verify(accessToken, ACCESS_TOKEN_SECRET_KEY, option);
    return decode;
  }

  verifyRefreshToken(refreshToken, option?: jwt.VerifyOptions) {
    const decode = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET_KEY, option);
    return decode;
  }
}
