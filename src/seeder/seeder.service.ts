import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from 'src/permissions/entity/permission.entity';
import { Role } from 'src/roles/entity/role.entity';
import { User } from 'src/users/entity/user.entity';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SeederService {
    constructor(
        private configService: ConfigService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
        @InjectRepository(Permission)
        private readonly permissionRepository: Repository<Permission>
    ) { }
    async seed() {
        await this.seederPermission();
        await this.seederRole();
        await this.seederUser();
        console.log('Mock data inserted into the database successfully.');
    }

    async seederRole(){

        const permission = await this.permissionRepository.find();

        const roles = this.roleRepository.create([
            { id: 1, name: 'Admin' , description: 'Administrator', permission: permission },
            { id: 2, name: 'patient' , description: 'คนไข้', permission: [permission[0]] },
            { id: 3, name: 'nurse' , description: 'พยาบาล', permission: [permission[0], permission[1], permission[2]] },
            { id: 4, name: 'doctor' , description: 'หมอ',permission:[permission[0], permission[1], permission[2]] },
        ]);

        await this.roleRepository.save(roles);

        console.log('Mock roles data');
    }

    async seederPermission(){

        const permissions = this.permissionRepository.create([
            { id:1,name: 'View Permissions', description: 'View Permissions' },
            { id:2,name: 'Create Permissions', description: 'Create Permissions' },
            { id:3,name: 'Update Permissions', description: 'Update Permissions' },
            { id:4,name: 'Delete Permissions', description: 'Delete Permissions' },
        ]);

        await this.permissionRepository.save(permissions);

        console.log('Mock permissions data');
    }

    async seederUser(){

        const role = this.roleRepository.find();

        const passwrord = await argon2.hash(this.configService.get<string>('SUPER_ADMIN_PASS'));
        const users = this.userRepository.create([
            { 
            id: 1
            , ssid: '1309903087352'
            , sex: 'Male'
            , phone: "1111111111"
            , first_name: 'Super'
            , last_name: 'Admin'
            , birthdate: new Date()
            , password: passwrord
            ,profile_image: 'profile.png'
            , role: [role[0]]
            }

        ]);

        await this.userRepository.save(users);

        console.log('Mock user data');
    }
}
