import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from "./config/typeorm.config"
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [UsersModule,
    RolesModule,
    PermissionsModule,
    ConfigModule.forRoot({
      isGlobal: true,  // makes the config module global
      envFilePath: '.env',  // path to your .env file
    })
    , TypeOrmModule.forRoot(
      typeOrmConfig
    ),
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
