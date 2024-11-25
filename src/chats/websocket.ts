import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ChatsService } from './chats.service';
import { CreateChatDto } from './dto/create-chat.dto';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class ChatGateway {
    @WebSocketServer()
    server: Server;

    constructor(private readonly chatService: ChatsService) { }

    @SubscribeMessage('sendMessage')
    async handleMessage(@MessageBody() data: CreateChatDto) {
        const chat = await this.chatService.sendMessage(data);
        this.server.to(`room_${data.roomId}`).emit('message', chat);
        return chat;
    }

    @SubscribeMessage('joinRoom')
    handleJoinRoom(@MessageBody() roomId: number, client: any) {
        client.join(`room_${roomId}`);
        return { event: 'joinedRoom', roomId };
    }
}
