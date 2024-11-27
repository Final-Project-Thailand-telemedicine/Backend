import { Module } from '@nestjs/common';
import { ChatsController } from './chats.controller';
import { ChatsService } from './chats.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entity/chat.entity';
import { ChatGateway } from './websocket';
import { RoomsModule } from 'src/rooms/rooms.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Chat]),
    RoomsModule
  ],
  controllers: [ChatsController],
  providers: [ChatsService,ChatGateway]
})
export class ChatsModule {}
