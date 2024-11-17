import { IsArray, IsString } from 'class-validator';

export class AssignRoleDto {
  @IsString()
  id: string;

  @IsArray()
  @IsString({ each: true }) 
  roles: string[];
}
