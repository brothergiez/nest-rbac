import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import slugify from 'slugify';

import { Role } from './schemas/role.schema';
import { User } from '../users/schemas/user.schema';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name) private roleModel: Model<Role>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) { }

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

  async updateRole(editRoleDto: UpdateRoleDto): Promise<Role> {
    const { slug, name, permissions } = editRoleDto;

    // Find the role by slug
    const role = await this.roleModel.findOne({ slug }).exec();
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    if (name) role.name = name;
    if (permissions) role.permissions = permissions;

    return role.save();
  }

  async deleteRole(slug: string): Promise<void> {
    const role = await this.roleModel.findOne({ slug }).exec();
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    const usersWithRole = await this.userModel.find({ roles: slug }).countDocuments();
    if (usersWithRole > 0) {
      throw new ConflictException(
        'Cannot delete role: Users are assigned to this role',
      );
    }

    await this.roleModel.deleteOne({ slug }).exec();
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
