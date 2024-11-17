import { IsString, IsArray, IsEmail, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail() // Validasi email
  email: string;

  @IsString()
  @MinLength(6) // Minimum panjang password
  password: string;

  @IsArray()
  roles: string[]; // Array of role IDs
}
