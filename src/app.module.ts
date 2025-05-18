import { Module } from '@nestjs/common';
import { InfraModule } from './infra/infra.module';
import { UserModule } from './modules/users/user.module';

@Module({
  imports: [InfraModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
