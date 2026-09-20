import { IsNotEmpty, IsString } from 'class-validator';

export class SaveTotpDto {
  @IsNotEmpty()
  @IsString()
  secret: string;

  @IsNotEmpty()
  @IsString()
  token: string;
}
