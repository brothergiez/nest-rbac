import { IsArray, IsString } from 'class-validator';

export class AssignRoleDto {
  @IsString()
  id: string; // User ID sent in the body

  @IsArray()
  @IsString({ each: true }) // Ensure all array elements are strings
  roles: string[];
}
