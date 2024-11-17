import { Controller, Get, Post, Put, Param, Body, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AssignRoleDto } from './dto/assign-role.dto';
import { DynamicRoles } from '../roles/decorators/dynamic-roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/create')
  @DynamicRoles('users', 'create')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  @DynamicRoles('users', 'view')
  async findAllUsers() {
    return this.usersService.findAllUsers();
  }

  @Get('/getme')
  async getMe(@Req() req: any) {
    const userId = req.user.id; 
    return this.usersService.findUserById(userId);
  }

  @Post('/assign-roles') 
  @DynamicRoles('users', 'edit')
  async assignRolesToUser(@Body() assignRoleDto: AssignRoleDto) {
    const { id, roles } = assignRoleDto;
    return this.usersService.assignRolesToUser(id, roles);
  }

  @Get(':id')
  @DynamicRoles('users', 'view')
  async findUserById(@Param('id') id: string) {
    return this.usersService.findUserById(id);
  }
}
