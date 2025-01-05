import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from 'src/permissions/entity/permission.entity';
import { Role } from 'src/roles/entity/role.entity';
import { User } from 'src/users/entity/user.entity';
import { In, Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { ConfigService } from '@nestjs/config';
import { Treat } from 'src/treat/entity/treat.entity';
import { WoundState } from 'src/woundstate/entity/woundstate.entity';

@Injectable()
export class SeederService {
    constructor(
        private configService: ConfigService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
        @InjectRepository(Permission)
        private readonly permissionRepository: Repository<Permission>,
        @InjectRepository(Treat)
        private readonly treatRepository: Repository<Treat>,
        @InjectRepository(WoundState)
        private readonly woundstateRepository: Repository<WoundState>,
    ) { }
    async seed() {
        await this.seederPermission();
        await this.seederRole();
        await this.seederUser();
        await this.seederTreat();
        await this.seederWoundState();
        console.log('Mock data inserted into the database successfully.');
    }

    async seederRole() {

        const permission = await this.permissionRepository.find();

        const roles = this.roleRepository.create([
            { id: 1, name: 'Admin', description: 'Administrator', permission: permission },
            { id: 2, name: 'patient', description: 'คนไข้', permission: [permission[0]] },
            { id: 3, name: 'nurse', description: 'พยาบาล', permission: [permission[0], permission[1], permission[2]] },
            { id: 4, name: 'doctor', description: 'หมอ', permission: [permission[0], permission[1], permission[2]] },
        ]);

        await this.roleRepository.save(roles);

        console.log('Mock roles data');
    }

    async seederPermission() {

        const permissions = this.permissionRepository.create([
            { id: 1, name: 'View Permissions', description: 'View Permissions' },
            { id: 2, name: 'Create Permissions', description: 'Create Permissions' },
            { id: 3, name: 'Update Permissions', description: 'Update Permissions' },
            { id: 4, name: 'Delete Permissions', description: 'Delete Permissions' },
        ]);

        await this.permissionRepository.save(permissions);

        console.log('Mock permissions data');
    }

    async seederUser() {

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
                , profile_image: 'static/profile.png'
                , role: [role[0]]
            }

        ]);

        await this.userRepository.save(users);

        console.log('Mock user data');
    }

    async seederTreat() {
        const treat = this.treatRepository.create([
            { id: 1, description: 'พลิกตัวผู้ป่วยทุก 1-2 ชั่วโมง' },
            { id: 2, description: 'ทาครีมดูแลรอยแดง' },
            { id: 3, description: 'รักษาความสะอาดและแผลให้แห้งเสมอ' },
            { id: 4, description: 'ล้างแผลด้วยน้ำเกลือ' },
            { id: 5, description: 'ใช้ยาฆ่าเชื้อในการดูแลแผล' },
            { id: 6, description: 'ปิดแผลด้วยผ้าปลอดเชื้อ' },
            { id: 7, description: 'ใช้อุปกรณ์ลดแรงกดทับ' },
            { id: 8, description: 'แนะนำพบแพทย์เพื่อรับการรักษาเพิ่มเติม' },
        ])

        await this.treatRepository.save(treat);

        console.log('Mock treat data');
    }

    async seederWoundState() {
        const treat = await this.treatRepository.find();
        const woundstate = this.woundstateRepository.create([
            { id: 1, state: 1, description: 'ระดับ 1: ผิวหนังแดงหรือเปลี่ยนสี แต่ไม่มีแผลเปิด มีอาการเจ็บหรืออุ่นเมื่อสัมผัส', treat: [treat[0], treat[1], treat[2]] },
            { id: 2, state: 2, description: 'ระดับ 2: ผิวหนังเปิดเป็นแผลตื้นๆ เห็นชั้นหนังกำพร้าหรือหนังแท้ อาจมีตุ่มน้ำพอง', treat: [treat[0], treat[3], treat[4], treat[5], treat[6]] },
            { id: 3, state: 3, description: 'ระดับ 3: แผลลึกถึงชั้นไขมันใต้ผิวหนัง มีเนื้อตายหรือของเหลวซึม', treat: [treat[0], treat[3], treat[4], treat[7]] },
            { id: 4, state: 4, description: 'ระดับ 4: แผลลึกถึงกล้ามเนื้อ กระดูก หรือเส้นเอ็น มีเนื้อตายสีดำและการติดเชื้อ', treat: [treat[0], treat[3], treat[4], treat[7]] },
        ])

        await this.woundstateRepository.save(woundstate);

        console.log('Mock woundstate data');
    }

}
