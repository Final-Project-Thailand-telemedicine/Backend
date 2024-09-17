import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from "./config/typeorm.config"
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [UsersModule, RolesModule, PermissionsModule
    ,TypeOrmModule.forRoot(
    typeOrmConfig
  ), AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
