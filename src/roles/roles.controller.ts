import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { DeleteRoleDto } from './dto/delete-role.dto';
import { DynamicRoles } from './decorators/dynamic-roles.decorator';


@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post('/create')
  @DynamicRoles('roles', 'create')
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.createRole(createRoleDto);
  }

  @Get()
  @DynamicRoles('roles', 'view')
  async findAllRoles() {
    return this.rolesService.findAllRoles();
  }

  @Get(':id')
  @DynamicRoles('roles', 'view')
  async findRoleById(@Param('id') id: string) {
    return this.rolesService.findRoleById(id);
  }

  @Post('edit')
  @DynamicRoles('roles', 'edit')

  async updateRole(@Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.updateRole(updateRoleDto);
  }

  @Post('delete')
  @DynamicRoles('roles', 'delete')
  async deleteRole(@Body() deleteRoleDto: DeleteRoleDto) {
    return this.rolesService.deleteRole(deleteRoleDto.slug);
  }
}
