import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { User } from './schemas/user.schema';
import { Role } from '../roles/schemas/role.schema';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Role.name) private roleModel: Model<Role>,
  ) {}

  async getUserRoles(userId: string): Promise<Role[]> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new Error('User not found');
    }
    return this.roleModel.find({ _id: { $in: user.roles } }).exec();
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, name, roles } = createUserDto;

    const existingUser = await this.userModel.findOne({ email }).exec();
    if (existingUser) {
      throw new ConflictException('Email is already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await new this.userModel({
      name,
      email,
      password: hashedPassword,
      roles,
    }).save();

    const userObject = newUser.toObject();
    delete userObject.password;
    delete userObject.__v;
    delete userObject._id;
  
    return userObject;
  }

  async findAllUsers(): Promise<User[]> {
    return this.userModel.find({}, { password: 0, __v: 0 }).exec();
  }

  async findUserById(id: string): Promise<User> {
    if (!isValidObjectId(id)) {
      throw new NotFoundException('User not found');
    }
    
    return this.userModel.findById(id, { password: 0,  __v: 0}).exec();
  }

  async findByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email }).exec();
  }

  async assignRolesToUser(userId: string, roles: string[]): Promise<User> {
    if (!isValidObjectId(userId)) {
      throw new NotFoundException('User not found');
    }

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    user.roles = roles;
    const updatedUser = await user.save();

    const userObject = updatedUser.toObject();
    delete userObject.password;
    delete userObject.__v;
    delete userObject._id;
  
    return userObject;
  }
}
