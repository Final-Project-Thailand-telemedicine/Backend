import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from 'src/roles/entity/role.entity';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Role)
        private roleReopository: Repository<Role>
    ) { }


    findByUsername(user_name: string) {
        return this.userRepository.findOne({
            where: { user_name },
            relations: { role: {} }
        });
    }
    async getbyId(id: number) {
        const user = await this.userRepository.findOneBy({ id });
        // console.log(user);

        if (!user) throw new BadRequestException('user not found');
        return user;
    }

    async create(createUserDto: CreateUserDto) {
        const usernameIsExist = await this.userRepository.existsBy({ user_name: createUserDto.user_name });
        if (usernameIsExist) throw new BadRequestException('username already exists');

        const { roleId } = createUserDto;

        const role = await this.roleReopository.findOneBy({ id: roleId });
        if (!role) throw new BadRequestException('role not found');

        const hash = await argon2.hash(createUserDto.password);
        const user = this.userRepository.create({
            ...createUserDto,
            password: hash,
        });

        if (roleId) {
            const role = await this.roleReopository.find({
                where: { id: roleId },
            });
            console.log(role);

            user.role = role;
        }
        console.log(user);

        return this.userRepository.save(user);
    }

    update(data: any) {
        return `this is update id: ${data.name}`;
    }

    delete(id: number) {
        return `this is delete id: ${id}`;
    }

    // async updateRefreshToken(userId: number, token: string) {
    //     await this.userRepository.update(userId, {
    //       refreshToken: token,
    //     });
    //   }

}
