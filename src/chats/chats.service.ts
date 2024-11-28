import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat, MessageType } from './entity/chat.entity';
import { CreateChatDto } from './dto/create-chat.dto';
import { RoomsService } from 'src/rooms/rooms.service';

@Injectable()
export class ChatsService {
    constructor(
        @InjectRepository(Chat) private chatRepository: Repository<Chat>,
        private readonly roomService: RoomsService,
    ) { }

    async sendMessage(roomId:number,senderId:number,messageType:string,message?:string,imageUrl?:string) {
        console.log(messageType);
        
        if(messageType === MessageType.Image) {
            const room = await this.roomService.findbyId(roomId);
            if(!room) {
                throw new NotFoundException('Room not found');
            }
            const chat = this.chatRepository.create({
                room: { id: roomId },
                sender: { id: senderId },
                imageUrl: imageUrl,
                messageType: messageType
            });
            return this.chatRepository.save(chat);
        }else if(messageType === MessageType.Text) {
            const room = await this.roomService.findbyId(roomId);
            if(!room) {
                throw new NotFoundException('Room not found');
            }
            const chat = this.chatRepository.create({
                room: { id: roomId },
                sender: { id: senderId },
                message: message,
                messageType: messageType
            });
            return this.chatRepository.save(chat);
        }else{
            throw new NotFoundException('Invalid message type');
        }
    }

    async findMessagesByRoom(roomId: number) {
        const messages = await this.chatRepository.find({
            where: { room: { id: roomId } },
            relations: ['sender'],
            order: { createdAt: 'ASC' },
        });
    
        // Transform the sender field to include only id and fullname
        return messages.map(message => ({
            ...message,
            sender: {
                id: message.sender.id,
                fullname: `${message.sender.first_name} ${message.sender.last_name}`,
            },
        }));
    }
    

}
