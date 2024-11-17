import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import slugify from 'slugify';

import { Role } from './schemas/role.schema';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role.name) private roleModel: Model<Role>) {}

  async createRole(createRoleDto: CreateRoleDto): Promise<Role> {
    const { name, permissions } = createRoleDto;

    const slug = slugify(name, { lower: true, strict: true });

    const existingRole = await this.roleModel.findOne({ slug }).exec();
    if (existingRole) {
      throw new ConflictException('Role with this name already exists');
    }

    const newRole = new this.roleModel({
      name,
      slug,
      permissions,
    });

    return newRole.save();
  }

  async findAllRoles(): Promise<Role[]> {
    return this.roleModel.find().exec();
  }

  async findRoleById(id: string): Promise<Role> {
    if (!isValidObjectId(id)) {
      throw new NotFoundException('Role not found');
    }

    return this.roleModel.findById(id).exec();
  }

  async updateRole(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    if (!isValidObjectId(id)) {
      throw new NotFoundException('Role not found');
    }

    return this.roleModel.findByIdAndUpdate(id, updateRoleDto, { new: true }).exec();
  }

  async deleteRole(id: string): Promise<Role> {
    if (!isValidObjectId(id)) {
      throw new NotFoundException('Role not found');
    }

    return this.roleModel.findByIdAndDelete(id).exec();
  }

    async findByName(roleName: string): Promise<Role> {
      return this.roleModel.findOne({ name: roleName }).exec();
    }
  
    async getRolesWithPermission(module: string, action: string): Promise<string[]> {
      const roles = await this.roleModel.find({
        permissions: {
          $elemMatch: { module, actions: action },
        },
      });
  
      return roles.map((role) => role.name);
    }
}
