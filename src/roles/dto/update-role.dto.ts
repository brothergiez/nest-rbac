import { IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class PermissionDto {
  @IsString()
  module: string;

  @IsArray()
  actions: string[];
}

export class UpdateRoleDto {
  @IsString()
  slug: string; // Identify the role to edit

  @IsString()
  @IsOptional() // Optional if the name doesn't change
  name?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PermissionDto)
  @IsOptional() // Optional if permissions don't change
  permissions?: PermissionDto[];
}
