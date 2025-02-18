import { Module } from '@nestjs/common';
import { ChatsController } from './chats.controller';
import { ChatsService } from './chats.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entity/chat.entity';
import { ChatGateway } from './websocket';
import { RoomsModule } from 'src/rooms/rooms.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Chat]),
    RoomsModule,
    UsersModule
  ],
  controllers: [ChatsController],
  providers: [ChatsService,ChatGateway]
})
export class ChatsModule {}
