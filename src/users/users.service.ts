import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';
import { Role } from 'src/roles/entity/role.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entity/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { Helper } from "src/common/helper";

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Role)
        private roleReopository: Repository<Role>
    ) { }

    // Method to find a user by username
    findBySSID(ssid: string) {
        return this.userRepository.findOne({
            where: { ssid },
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

    async getProfile(id: number) {
        const user = await this.userRepository.findOne({
            where: { id },
            relations: ["role"],
            select: ["id", "first_name", "last_name", "ssid", "profile_image"],
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


    async update(id: number, updateUserDto: UpdateUserDto) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) throw new BadRequestException('User not found');
        if(updateUserDto.password){
            const hashedPassword = await argon2.hash(updateUserDto.password);

            return this.userRepository.update(id,{
                ...user,
                password:hashedPassword
            });
        }
        return this.userRepository.update(id, updateUserDto);
        
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

    async addRoleToUser(userId: number, roleId: number): Promise<User> {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['role'],
        });
        if (!user) throw new NotFoundException('User not found');

        const role = await this.roleReopository.findOne({ where: { id: roleId } });
        if (!role) throw new NotFoundException('Role not found');

        if (user.role.some(existingRole => existingRole.id === role.id)) {
            // Role already assigned to user
            return user;
        }

        user.role.push(role);
        return this.userRepository.save(user);
    }
    async checkssid(ssid: string) {
        const check = Helper.validateThaiSSID(ssid);
        return check;
    }
}