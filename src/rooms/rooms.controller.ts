import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('room (ห้อง)')
@Controller('rooms')
export class RoomsController {
    constructor(private readonly roomService: RoomsService) { }

    @ApiOperation({ summary: 'สร้างห้อง' })
    @Post()
    createRoom(@Body() body: CreateRoomDto) {
        return this.roomService.createRoom(body);
    }

    @ApiOperation({ summary: 'ดูห้องทั้งหมด' })
    @Get()
    findAllRooms() {
        return this.roomService.findAllRooms();
    }

    @ApiOperation({ summary: 'เข้าห้อง' })
    @Get(':roomId/:userId')
    joinRoom(@Param('roomId') roomId: number, @Param('userId') userId: number) {
        return this.roomService.joinRoom(roomId, userId);
    }

    @ApiOperation({ summary: 'เข้าห้องโดยการตรวจ' })
    @Get('perusal/:perusalId/:userId')
    joinRoomfromPerusal(@Param('perusalId') perusalId: number, @Param('userId') userId: number) {
        return this.roomService.joinRoomfromPerusal(perusalId, userId);
    }

    @ApiOperation({ summary: 'ดูห้องของผู้ใช้' })
    @Get(':userId')
    findbyUserId(@Param('userId') userId: number) {
        return this.roomService.findByUserId(userId);
    }
}
