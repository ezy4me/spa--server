import { IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  username: string;

  @IsString()
  @MinLength(5)
  password: string;

  @IsString()
  role: string;
}
