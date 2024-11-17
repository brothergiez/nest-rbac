import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true }) // Tambahkan email dengan unique constraint
  email: string;

  @Prop({ required: true }) // Password terenkripsi
  password: string;

  @Prop({ type: [String], required: true })
  roles: string[];

  @Prop()
  __v?: number; // Tambahkan __v sebagai properti opsional
}

export const UserSchema = SchemaFactory.createForClass(User);
