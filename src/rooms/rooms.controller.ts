import { Body, Controller, Get, Post } from '@nestjs/common';
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
}
