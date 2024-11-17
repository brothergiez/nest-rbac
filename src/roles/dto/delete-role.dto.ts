import { IsString } from 'class-validator';

export class DeleteRoleDto {
  @IsString()
  slug: string; // Identify the role to delete
}
