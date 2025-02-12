import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Perusal } from 'src/perusal/entity/perusal.entity';
import { User } from 'src/users/entity/user.entity';
import { Repository } from 'typeorm';
import { CreateNurseRoomDto } from './dto/create-nurse-room.dto';
import { CreateRoomDto } from './dto/create-room.dto';
import { Room } from './entity/room.entity';

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

        const room = this.roomRepository.create({ ...CreateRoomDto, owner: { id: CreateRoomDto.ownerId }, perusal: { id: CreateRoomDto.perusalId } });
        await this.roomRepository.save(room);

        return await this.joinRoom(room.id, CreateRoomDto.ownerId);

    }

    async createRoomNurse(CreateNurseRoomDto: CreateNurseRoomDto) {
        
        if (!CreateNurseRoomDto.name || !CreateNurseRoomDto.perusalId || !CreateNurseRoomDto.ownerId) {
            throw new NotFoundException('Invalid room data');
        }
        const perusal = await this.perusalRepository.findOneBy({ id: CreateNurseRoomDto.perusalId });
        if (!perusal) throw new NotFoundException();
        const user = await this.userRepository.findOneBy({ id: CreateNurseRoomDto.ownerId });
        if (!user) throw new NotFoundException();

        const room = this.roomRepository.create({ ...CreateNurseRoomDto, owner: { id: CreateNurseRoomDto.ownerId }, perusal: { id: CreateNurseRoomDto.perusalId } });
        await this.roomRepository.save(room);

        await this.joinRoom(room.id, CreateNurseRoomDto.ownerId);
        await this.joinRoom(room.id, CreateNurseRoomDto.patientId);
        return room;

    }

    async joinRoom(roomId: number, userId: number) {
        const room = await this.roomRepository.findOneBy({ id: roomId });
        if (!room) throw new NotFoundException('Room not found');
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['room'],
        });
        if (!user) throw new NotFoundException('User not found');

        if (user.room.some(existingRoom => existingRoom.id === room.id)) {
            // Room already assigned to user
            return user;
        }
        user.room.push(room);

        return this.userRepository.save(user);
    }

    async joinRoomfromPerusal(perusalId: number, userId: number) {
        const room = await this.roomRepository.findOneBy({ perusal: { id: perusalId } });
        if (!room) throw new NotFoundException('Room not found');
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['room'],
        });
        if (!user) throw new NotFoundException('User not found');

        if (user.room.some(existingRoom => existingRoom.id === room.id)) {
            // Room already assigned to user
            return user;
        }
        user.room.push(room);

        return this.userRepository.save(user);
    }

    async findAllRooms(): Promise<Room[]> {
        return this.roomRepository.find({ relations: ['owner'] });
    }

    async findbyId(id: number): Promise<Room> {
        const room = await this.roomRepository.findOneBy({ id });
        if (!room) throw new NotFoundException('Room not found');
        return room;
    }

    async findByUserId(userId: number): Promise<Room[]> {
        const rooms = await this.roomRepository.find({
            where: { user: { id: userId } },
            relations: ['owner', 'user'],
        });

        return rooms;
    }

    async getPerusalId(roomId: number) {
        const rooms = await this.roomRepository.find({
            where: { id: roomId },
            relations: ['perusal'],
        });

        const perusal_id = { perusal_id: rooms[0].perusal.id };

        return perusal_id;
    }
}
