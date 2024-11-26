import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    WebSocketServer,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class ChatGateway {
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
    handleJoinRoom(@MessageBody() roomId: number, @ConnectedSocket() client: WebSocket) {
        const roomKey = `room_${roomId}`;
        if (!this.rooms.has(roomKey)) {
            this.rooms.set(roomKey, new Set());
        }
        this.rooms.get(roomKey)?.add(client);

        client.send(JSON.stringify({ event: 'joinedRoom', roomId }));
    }

    @SubscribeMessage('sendMessage')
    handleMessage(@MessageBody() data: { roomId: number; content: string }, @ConnectedSocket() client: WebSocket) {
        const roomKey = `room_${data.roomId}`;
        const clients = this.rooms.get(roomKey);

        if (clients) {
            for (const roomClient of clients) {
                roomClient.send(JSON.stringify({ event: 'message', content: data.content }));
            }
        }
    }
}
