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
import { UploadModule } from './upload/upload.module';
import { PerusalModule } from './perusal/perusal.module';
import { DiagnosisModule } from './diagnosis/diagnosis.module';
import { WoundModule } from './wound/wound.module';
import { SeederModule } from './seeder/seeder.module';
import { AppointmentModule } from './appointment/appointment.module';
import { RoomsModule } from './rooms/rooms.module';
import { ChatsModule } from './chats/chats.module';
import { ChatGateway } from './chats/websocket';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { NotificationModule } from './notification/notification.module';

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
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // Serve files from "uploads" directory
      serveRoot: '/', // Accessible via /uploads path
    }),
    AuthModule,
    UploadModule,
    PerusalModule,
    DiagnosisModule,
    WoundModule,
    SeederModule,
    AppointmentModule,
    RoomsModule,
    ChatsModule,
    NotificationModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
