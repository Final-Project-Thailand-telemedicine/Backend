import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './entity/room.entity';
import { CreateRoomDto } from './dto/create-room.dto';

@Injectable()
export class RoomService {
    constructor(
        @InjectRepository(Room)
        private roomRepository: Repository<Room>,
    ) { }

    async createRoom(CreateRoomDto: CreateRoomDto) {
        const room = this.roomRepository.create({ ...CreateRoomDto, owner: { id: CreateRoomDto.ownerId } });
        return this.roomRepository.save(room);
    }

    async findAllRooms(): Promise<Room[]> {
        return this.roomRepository.find({ relations: ['owner'] });
    }
}
