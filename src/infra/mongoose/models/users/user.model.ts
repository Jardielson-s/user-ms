import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export class Address {
  @Prop({ required: true, unique: true })
  street: string;
  @Prop({ required: true, unique: true })
  addressNumber: string;
  @Prop({ required: true, unique: true })
  postalCode: number;
}

@Schema({ timestamps: true })
export class UserModel extends Document {
  @Prop()
  _id: Types.ObjectId;

  @Prop({ required: false, unique: true })
  externalId?: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  ein: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  age: number;

  @Prop({ required: true })
  address: Address;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(UserModel);
