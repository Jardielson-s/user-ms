import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './mongoose/models/users/user.model';
import { UserRepository } from './mongoose/repositories/users/user.repository';
import { SqsModule } from '@ssut/nestjs-sqs';
import { SqsProduce } from './sqs/sqs.producer';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGO_URI || 'mongodb://localhost:27018/vehicles-db',
    ),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    SqsModule.register({
      consumers: [],
      producers: [
        {
          name: String(process.env.AWS_SQS_QUEUE_NAME),
          queueUrl: String(process.env.AWS_SQS_QUEUE_URL),
          region: String(process.env.AWS_REGION),
        },
      ],
    }),
  ],
  providers: [UserRepository, SqsProduce],
  exports: [UserRepository, SqsProduce],
})
export class InfraModule {}
