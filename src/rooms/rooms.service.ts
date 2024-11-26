import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './entity/room.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { User } from 'src/users/entity/user.entity';
import { Perusal } from 'src/perusal/entity/perusal.entity';

@Injectable()
export class RoomsService {
    constructor(
        @InjectRepository(Room)
        private roomRepository: Repository<Room>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Perusal)
        private perusalRepository: Repository<Perusal>,
    ) { }

    async createRoom(CreateRoomDto: CreateRoomDto) {
        if (!CreateRoomDto.name || !CreateRoomDto.perusalId || !CreateRoomDto.ownerId) {
            throw new NotFoundException('Invalid room data');
        }
        const perusal = await this.perusalRepository.findOneBy({ id: CreateRoomDto.perusalId });
        if (!perusal) throw new NotFoundException();
        const user = await this.userRepository.findOneBy({ id: CreateRoomDto.ownerId });
        if (!user) throw new NotFoundException();

        const room = this.roomRepository.create({ ...CreateRoomDto, owner: { id: CreateRoomDto.ownerId } ,perusal: { id: CreateRoomDto.perusalId } });
        return this.roomRepository.save(room);
    }

    async findAllRooms(): Promise<Room[]> {
        return this.roomRepository.find({ relations: ['owner'] });
    }
}
