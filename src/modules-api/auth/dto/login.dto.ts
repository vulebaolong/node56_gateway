import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'trinhanthanh@gmail.com' })
  @IsNotEmpty()
  @IsEmail({}, { message: 'vui lòng nhập email hợp lệ' })
  email: string;

  @ApiProperty({ example: 'CyberSoft@123' })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({ example: '123456', required: false })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  token?: string;
}
