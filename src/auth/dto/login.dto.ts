import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail() // Validasi email
  email: string;

  @IsString()
  @MinLength(6) // Minimum panjang password
  password: string;
}
