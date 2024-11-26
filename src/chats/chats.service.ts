import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './entity/chat.entity';
import { CreateChatDto } from './dto/create-chat.dto';

@Injectable()
export class ChatsService {
    constructor(
        @InjectRepository(Chat) private chatRepository: Repository<Chat>,
    ) { }

    async sendMessage(CreateChatDto: CreateChatDto) {
        const chat = this.chatRepository.create({
            room: { id: CreateChatDto.roomId },
            sender: { id: CreateChatDto.senderId },
            message: CreateChatDto.message,
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
}
