import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';
import { Role } from 'src/roles/entity/role.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entity/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import {Helper} from "src/common/helper";

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Role)
        private roleReopository: Repository<Role>
    ) { }

    // Method to find a user by username
    findByUsername(user_name: string) {
        return this.userRepository.findOne({
            where: { user_name },
            relations: { role: {} }
        });
    }

    // Method to get a user by ID
    async getbyId(id: number) {
        const user = await this.userRepository.findOne({
            where: { id },
            relations: ["role"],
        });

        if (!user) throw new BadRequestException('User not found');
        return user;
    }

    // Modified create method to handle user registration
    async create(createUserDto: CreateUserDto) {
        // Check if username already exists
        const SSIDExists = await this.userRepository.findOne({ where: { ssid: createUserDto.ssid } });
        if (SSIDExists) throw new BadRequestException('SSID already exists');

        //check format SSID
        const check = Helper.validateThaiSSID(String(createUserDto.ssid));
        if (!check) throw new BadRequestException('Invalid SSID format');

        // Check if email already exists
        const emailExists = await this.userRepository.findOne({ where: { user_email: createUserDto.user_email } });
        if (emailExists) throw new BadRequestException('Email already exists');

        // Hash the password
        const hashedPassword = await argon2.hash(createUserDto.password);

        // Create the new user instance
        const user = this.userRepository.create({
            ...createUserDto,
            password: hashedPassword,
            role: [], // Initialize with an empty array or set default roles
        });

        // Assign role if provided
        if (createUserDto.roleId) {
            const role = await this.roleReopository.findOne({ where: { id: createUserDto.roleId } });
            if (!role) throw new BadRequestException('Role not found');
            user.role.push(role);
        }

        return this.userRepository.save(user);
    }

    // Method to update a user (implementation needed)
    async update(id: number, updateUserDto: UpdateUserDto) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) throw new BadRequestException('User not found');

        // Update only fields that are provided in the updateUserDto
        Object.assign(user, updateUserDto);
        return this.userRepository.save(user);
    }

    // Method to delete a user (implementation needed)
    async delete(id: number) {
        const user = await this.getbyId(id)
        if (!user) throw new NotFoundException("user not found");

        const date = new Date().valueOf();

        await this.userRepository.update(id, {});

        await this.userRepository.softDelete(id);
    }

    // Method to update refresh token (if needed)
    async updateRefreshToken(userId: number, token: string) {
        await this.userRepository.update(userId, {
            refreshToken: token,
        });
    }

    async checkssid(ssid: string) {
        const check = Helper.validateThaiSSID(ssid);
        return check;
    }
}