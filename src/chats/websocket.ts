import { NotFoundException } from '@nestjs/common';
import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    WebSocketServer,
    ConnectedSocket,
} from '@nestjs/websockets';
import { RoomsService } from 'src/rooms/rooms.service';
import { Server, WebSocket } from 'ws';
import { ChatsService } from './chats.service';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class ChatGateway {
    constructor(
        private readonly roomService: RoomsService,
        private readonly chatService: ChatsService
    ) { }
    @WebSocketServer()
    server: Server;

    // Map to track clients and their rooms
    private rooms = new Map<string, Set<WebSocket>>();

    handleConnection(client: WebSocket) {
        console.log('Client connected: ', client);
    }

    handleDisconnect(client: WebSocket) {
        console.log('Client disconnected:', client);
        // Remove the client from any room it joined
        this.rooms.forEach((clients, roomId) => {
            clients.delete(client);
            if (clients.size === 0) {
                this.rooms.delete(roomId);
            }
        });
    }

    @SubscribeMessage('joinRoom')
    handleJoinRoom(@MessageBody() data: { roomId: number; userId: number }, @ConnectedSocket() client: WebSocket) {
        const roomKey = `room_${data.roomId}`;
        if (!this.rooms.has(roomKey)) {
            this.rooms.set(roomKey, new Set());
        }
        this.rooms.get(roomKey)?.add(client);

        if (this.roomService.joinRoom(data.roomId, data.userId)) {
            client.send(JSON.stringify({ event: 'joinedRoom', roomId: data.roomId }));
        }
        else {
            throw new NotFoundException('Room not found');
        }
        
    }

    @SubscribeMessage('sendMessage')
    handleMessage(@MessageBody() data: { roomId: number; sendId:number; content: string }, @ConnectedSocket() client: WebSocket) {
        const roomKey = `room_${data.roomId}`;
        const clients = this.rooms.get(roomKey);

        if (clients) {
            for (const roomClient of clients) {
                roomClient.send(JSON.stringify({ event: 'message', content: data.content }));
            }
            this.chatService.sendMessage(data.roomId,data.sendId,data.content);
        }
    }
}
