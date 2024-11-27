import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './entity/chat.entity';
import { CreateChatDto } from './dto/create-chat.dto';
import { RoomsService } from 'src/rooms/rooms.service';

@Injectable()
export class ChatsService {
    constructor(
        @InjectRepository(Chat) private chatRepository: Repository<Chat>,
        private readonly roomService: RoomsService,
    ) { }

    async sendMessage(roomId:number,senderId:number,message:string) {
        const chat = this.chatRepository.create({
            room: { id: roomId },
            sender: { id: senderId },
            message: message,
        });
        return this.chatRepository.save(chat);
    }

    async findMessagesByRoom(roomId:number) {
        return this.chatRepository.find({
            where: { room: { id: roomId } },
            relations: ['sender'],
            order: { createdAt: 'ASC' },
        });
    }

    async joinRoom(roomId: number, userId: number) {
        return this.roomService.joinRoom(roomId, userId);
    }
}
