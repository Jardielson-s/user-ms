import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './mongoose/models/users/user.model';
import { UserRepository } from './mongoose/repositories/users/user.repository';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGO_URI || 'mongodb://localhost:27018/vehicles-db',
    ),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  providers: [UserRepository],
  exports: [UserRepository],
})
export class InfraModule {}
