import { Module } from '@nestjs/common';
import { InfraModule } from 'src/infra/infra.module';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';

@Module({
  imports: [InfraModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
