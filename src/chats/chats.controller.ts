import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';

@ApiTags('chats (แชท)')
@Controller('chats')
export class ChatsController {
    constructor(private readonly chatService: ChatsService) { }

    @ApiOperation({ summary: 'ส่งข้อความ' })
    @Post()
    sendMessage(@Body() body: CreateChatDto) {
        return this.chatService.sendMessage(
            body.roomId,
            body.senderId,
            body.messageType,
            body.message,
            body.imageUrl
        );
    }

    @ApiOperation({ summary: 'ดึงข้อความทั้งหมดของห้อง' })
    @Get('/:roomId')
    @Auth()
    findMessagesByRoom(@Param('roomId') roomId: number) {
        return this.chatService.findMessagesByRoom(roomId);
    }
}
