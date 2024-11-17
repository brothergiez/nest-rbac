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
  slug: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PermissionDto)
  @IsOptional()
  permissions?: PermissionDto[];
}
