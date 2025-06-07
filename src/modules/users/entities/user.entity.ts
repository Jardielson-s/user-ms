import { Types } from 'mongoose';

export class UserEntity {
  readonly _id: Types.ObjectId;
  externalId?: string;
  name: string;
  ein: string;
  password: string;
  email: string;
  age: number;
  address: {
    street: string;
    addressNumber: string;
    postalCode: number;
  };

  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(input: Partial<UserEntity>) {
    Object.assign(this, input);
  }
}
