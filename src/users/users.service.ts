import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>) {
    }

    getbyId(id: number) {
        return `get by id: ${id}`;
    }

    async create(data: any) {
        const usernameIsExist = await this.userRepository.existsBy({ user_name: data.user_name });
        if (usernameIsExist) throw new BadRequestException('username already exists');

        const hash = await argon2.hash(data.password);
        const user = this.userRepository.create({
            ...data,
            password: hash,
        });
        console.log(user);
        
        return this.userRepository.save(user);
    }

    update(data: any) {
        return `this is update id: ${data.name}`;
    }

    delete(id: number) {
        return `this is delete id: ${id}`;
    }

}
