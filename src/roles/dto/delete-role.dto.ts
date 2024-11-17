import { IsString } from 'class-validator';

export class DeleteRoleDto {
  @IsString()
  slug: string;
}
