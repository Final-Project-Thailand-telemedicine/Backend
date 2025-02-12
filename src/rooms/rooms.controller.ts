import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateNurseRoomDto } from './dto/create-nurse-room.dto';
import { CreateRoomDto } from './dto/create-room.dto';
import { RoomsService } from './rooms.service';

@ApiTags('room (ห้อง)')
@Controller('rooms')
export class RoomsController {
    constructor(private readonly roomService: RoomsService) { }

    @ApiOperation({ summary: 'สร้างห้อง' })
    @Post()
    createRoom(@Body() body: CreateRoomDto) {
        return this.roomService.createRoom(body);
    }

    @ApiOperation({ summary: 'สร้างห้อง' })
    @Post('nurse')
    createRoomNurse(@Body() body: CreateNurseRoomDto) {
        return this.roomService.createRoomNurse(body);
    }

    @ApiOperation({ summary: 'ดูห้องทั้งหมด' })
    @Get()
    findAllRooms() {
        return this.roomService.findAllRooms();
    }

    @ApiOperation({ summary: 'เข้าห้อง' })
    @Get('join/:roomId/:userId')
    joinRoom(@Param('roomId') roomId: number, @Param('userId') userId: number) {
        return this.roomService.joinRoom(roomId, userId);
    }

    @ApiOperation({ summary: 'เข้าห้องโดยการตรวจ' })
    @Get('perusal/:perusalId/:userId')
    joinRoomfromPerusal(@Param('perusalId') perusalId: number, @Param('userId') userId: number) {
        return this.roomService.joinRoomfromPerusal(perusalId, userId);
    }

    @ApiOperation({ summary: 'ดูห้องของผู้ใช้' })
    @Get('user/:userId')
    findbyUserId(@Param('userId') userId: number) {
        return this.roomService.findByUserId(userId);
    }

    @ApiOperation({ summary: 'ดูการตรวจ by roomId' })
    @Get('perusal/:roomId')
    findPerusalbyRoomID(@Param('roomId') roomId: number) {
        return this.roomService.getPerusalId(roomId);
    }
}
