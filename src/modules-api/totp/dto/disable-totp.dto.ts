import { IsNotEmpty, IsString } from 'class-validator';

export class DisableTotpDto {
  @IsNotEmpty()
  @IsString()
  token: string;
}
