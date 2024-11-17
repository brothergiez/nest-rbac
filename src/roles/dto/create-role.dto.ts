import { IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ModulePermission {
  @IsString()
  module: string;

  @IsArray()
  actions: string[];
}

export class CreateRoleDto {
  @IsString()
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ModulePermission)
  permissions: ModulePermission[];
}
