import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Role extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ type: [{ module: String, actions: [String] }] })
  permissions: {
    module: string;
    actions: string[];
  }[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);
