import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';
import { Role } from 'src/roles/entity/role.entity';
import { In, Not, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entity/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { Helper } from "src/common/helper";
import { paginate, PaginateConfig, Paginated, PaginateQuery } from 'nestjs-paginate';
import { PatientNurse } from './entity/patientnurse.entity';
import { Perusal } from 'src/perusal/entity/perusal.entity';
import { JwtService } from '@nestjs/jwt';
import { ProfileUserDto } from './dto/profile-user.dto';

export const USER_PAGINATION_CONFIG: PaginateConfig<User> = {
    sortableColumns: ['id', 'first_name', 'last_name', 'ssid', 'sex', 'createdAt', 'updatedAt'],
    select: ['id', 'first_name', 'last_name', 'ssid', 'sex', 'profile_image', 'createdAt', 'updatedAt'],
};
@Injectable()
export class UsersService {

    constructor(
        private jwtService: JwtService,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Role)
        private roleReopository: Repository<Role>,
        @InjectRepository(PatientNurse)
        private patientNurseRepository: Repository<PatientNurse>,
        @InjectRepository(Perusal)
        private perusalRepository: Repository<Perusal>,
    ) { }

    // Method to find a user by username
    findBySSID(ssid: string) {
        return this.userRepository.findOne({
            where: { ssid },
            relations: ["role"],
        });
    }

    // Method to get a user by ID
    async getbyId(id: number) {
        const user = await this.userRepository.findOne({
            where: { id },
            relations: ["role"],
        });

        if (!user) throw new BadRequestException('ไม่พบผู้ใช้คนนี้ในระบบ');
        return user;
    }

    async getProfile(id: number) {
        const user = await this.userRepository.findOne({
            where: { id },
            relations: ["role"],
            select: ["id", "first_name", "last_name", "ssid", "profile_image"],
        });

        if (!user) throw new BadRequestException('ไม่พบผู้ใช้คนนี้ในระบบ');
        return user;
    }

    async getProfilebytoken(accessToken: string) {

        const data = this.jwtService.decode(accessToken);
        const user = await this.userRepository.findOne({
            where: { id: data.Uid },
            relations: ["role"],
            select: ["id", "first_name", "last_name", "ssid", "profile_image"],
        });

        if (!user) throw new BadRequestException('ไม่พบผู้ใช้คนนี้ในระบบ');
        return user;
    }

    // Modified create method to handle user registration
    async create(createUserDto: CreateUserDto) {

        const decrypt_password = await Helper.decryptData(createUserDto.password);

        const SSIDExists = await this.userRepository.findOne({ where: { ssid: createUserDto.ssid } });
        if (SSIDExists) throw new BadRequestException('เลขบัตรประชาชนนี้ถูกใช้งานแล้ว');

        const phoneExists = await this.userRepository.findOne({ where: { phone: createUserDto.phone } });
        if (phoneExists) throw new BadRequestException('เบอร์โทรศัพท์นี้ถูกใช้งานแล้ว');

        //check format SSID
        const check = Helper.validateThaiSSID(String(createUserDto.ssid));
        if (!check) throw new BadRequestException('เลขบัตรประชาชนไม่ถูกต้อง');

        const check2 = Helper.isValidThaiPhoneNumber(createUserDto.phone);
        if (!check2) throw new BadRequestException('เบอร์โทรศัพท์ไม่ถูกต้อง');
        // Hash the password
        const hashedPassword = await argon2.hash(decrypt_password);

        // Create the new user instance
        const user = this.userRepository.create({
            ...createUserDto,
            password: hashedPassword,
            role: [], // Initialize with an empty array or set default roles
        });

        // Assign role if provided
        if (createUserDto.roleId) {
            const role = await this.roleReopository.findOne({ where: { id: createUserDto.roleId } });
            if (!role) throw new BadRequestException('ไม่พบตำแหน่งนี้ในระบบ');
            user.role.push(role);
        }

        return this.userRepository.save(user);
    }


    async update(id: number, updateUserDto: UpdateUserDto) {
        console.log(updateUserDto);


        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) throw new BadRequestException('ไม่พบผู้ใช้คนนี้ในระบบ');

        if (updateUserDto.phone) {
            const existingUserWithPhone = await this.userRepository.findOne({
                where: { phone: updateUserDto.phone, id: Not(id) }
            });
            if (existingUserWithPhone) throw new BadRequestException('เบอร์โทรศัพท์นี้ถูกใช้งานแล้ว');
            const check = Helper.isValidThaiPhoneNumber(updateUserDto.phone);
            if (!check) throw new BadRequestException('เบอร์โทรศัพท์ไม่ถูกต้อง');
        }

        if (updateUserDto.ssid) {
            const existingUserWithSsid = await this.userRepository.findOne({
                where: { ssid: updateUserDto.ssid, id: Not(id) }
            });
            if (existingUserWithSsid) throw new BadRequestException('เลขบัตรประชาชนนี้ถูกใช้งานแล้ว');
            const check = Helper.validateThaiSSID(String(updateUserDto.ssid));
            if (!check) throw new BadRequestException('เลขบัตรประชาชนไม่ถูกต้อง');
        }

        let decrypt_password = '';
        if (updateUserDto.password) {
            decrypt_password = await Helper.decryptData(updateUserDto.password);
        }

        if (decrypt_password && decrypt_password.trim() !== '') {
            console.log(decrypt_password);

            const hashedPassword = await argon2.hash(decrypt_password);

            return this.userRepository.update(id, {
                ...updateUserDto,
                password: hashedPassword
            });
        }
        return this.userRepository.update(id, {
            password: user.password,
            ...updateUserDto
        });

    }

    async updateprofile(id: number, profileUserDto: ProfileUserDto) {

        if (profileUserDto.phone) {
            const existingUserWithPhone = await this.userRepository.findOne({
                where: { phone: profileUserDto.phone, id: Not(id) }
            });
            if (existingUserWithPhone) {
                throw new BadRequestException('เบอร์โทรศัพท์นี้ถูกใช้งานแล้ว');
            }
            const check = Helper.isValidThaiPhoneNumber(profileUserDto.phone);
            if (!check) throw new BadRequestException('เบอร์โทรศัพท์ไม่ถูกต้อง');
        }

        if (profileUserDto.ssid) {
            const existingUserWithSsid = await this.userRepository.findOne({
                where: { ssid: profileUserDto.ssid, id: Not(id) }
            });
            if (existingUserWithSsid) {
                throw new BadRequestException('เลขบัตรประชาชนนี้ถูกใช้งานแล้ว');
            }
            const check = Helper.validateThaiSSID(String(profileUserDto.ssid));
            if (!check) throw new BadRequestException('เลขบัตรประชาชนไม่ถูกต้อง');
        }
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) throw new BadRequestException('ไม่พบผู้ใช้คนนี้ในระบบ');

        return this.userRepository.update(id, {
            password: user.password,
            ...profileUserDto
        });

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
        if (!user) throw new NotFoundException('ไม่พบผู้ใช้คนนี้ในระบบ');

        const role = await this.roleReopository.findOne({ where: { id: roleId } });
        if (!role) throw new NotFoundException('ไม่พบตำแหน่งนี้ในระบบ');

        if (user.role.some(existingRole => existingRole.id === role.id)) {
            // Role already assigned to user
            return user;
        }

        user.role.push(role);
        return this.userRepository.save(user);
    }

    async getPagebyRole(query: PaginateQuery, roleId: number): Promise<Paginated<User>> {
        try {

            const queryBuilder = this.userRepository.createQueryBuilder('user')
                .innerJoinAndSelect('user.role', 'role')
                .where('role.id = :id', { id: roleId });

            // Apply search
            if (query.search && query.searchBy?.length > 0) {
                const searchConditions = query.searchBy.map(column => `user.${column} LIKE :search`).join(' OR ');
                queryBuilder.andWhere(`(${searchConditions})`, { search: `%${query.search}%` });
            }

            return await paginate(query, queryBuilder,
                USER_PAGINATION_CONFIG,

            );
        } catch (error) {
            console.error(`Error fetching users for role ID ${roleId}:`, error);
            throw new Error('Failed to fetch users for the specified role.');
        }
    }

    async allPatients() {
        return this.userRepository.find({
            where: { role: { id: 2 } },
            relations: ["role"],
        });
    }

    async allPatientsNotinNurse(nurseId: number) {

        const patientsNotInNurse = await this.patientNurseRepository.find({
            where: { nurse_id: nurseId },
        });

        const patientIds = patientsNotInNurse.map((pn) => pn.patient_id);

        const patientsNurses = await this.userRepository.find({
            where: { role: { id: 2 }, id: Not(In(patientIds)) },
            relations: ["role"],
        });

        return patientsNurses;

    }

    async allNurses() {
        return this.userRepository.find({
            where: { role: { id: 3 } },
            relations: ["role"],
        });
    }

    async allDoctors() {
        return this.userRepository.find({
            where: { role: { id: 4 } },
            relations: ["role"],
        });
    }

    async addPatientToNurse(patientId: number, nurseId: number) {
        const patient = await this.userRepository.findOne({ where: { id: patientId } });
        if (!patient) throw new NotFoundException('Patient not found');

        const nurse = await this.userRepository.findOne({ where: { id: nurseId } });
        if (!nurse) throw new NotFoundException('Nurse not found');

        const patientNurse = this.patientNurseRepository.create({
            patient_id: patientId,
            nurse_id: nurseId,
            patient,
            nurse,
        });

        return this.patientNurseRepository.save(patientNurse);
    }

    async getPatientbyNurseID(nurseId: number) {
        const patientsNurses = await this.patientNurseRepository.find({
            where: { nurse_id: nurseId },
            relations: ['patient'],
        });

        const patientWoundStatus = await Promise.all(
            patientsNurses.map(async (patient) => {
                const perusals = await this.perusalRepository.find({
                    where: { user: { id: patient.patient_id } },
                    relations: ['wound'],
                });

                // Determine patient_status
                let patientStatus = 'เรียบร้อย'; // Default status
                for (const perusal of perusals) {
                    for (const wound of perusal.wound) {
                        if (wound.status === 'รอตรวจ') {
                            patientStatus = 'รอตรวจ';
                            break;
                        }
                    }
                    if (patientStatus === 'รอตรวจ') break;
                }

                return {
                    patient_id: patient.patient_id,
                    nurse_id: patient.nurse_id,
                    patient: patient.patient,
                    patient_status: patientStatus,
                };
            })
        );

        return patientWoundStatus;
    }

    async getNursebyPatientID(patientId: number) {
        const patientsNurses = await this.patientNurseRepository.find({
            where: { patient_id: patientId },
            relations: ['nurse'],
        });

        return patientsNurses;
    }

    async deletePatientNurse(patientId: number, nurseId: number) {
        const patientNurse = await this.patientNurseRepository.findOne({
            where: { patient_id: patientId, nurse_id: nurseId },
        });
        if (!patientNurse) throw new NotFoundException('Patient-Nurse relationship not found');

        return this.patientNurseRepository.delete(patientNurse);
    }


    async checkssid(ssid: string) {
        const check = Helper.validateThaiSSID(ssid);
        return check;
    }

    async findfullnamebyId(id: number) {
        const user = await this.userRepository.findOne({
            where: { id },
            select: ["first_name", "last_name"],
        });

        if (!user) throw new BadRequestException('User not found');
        console.log(user);

        return user.first_name + " " + user.last_name;
    }

    async findUserIdbyPhone(phone: string) {
        const user = await this.userRepository.findOne({
            where: { phone: phone },
            select: ["id"],
        });

        if (!user) {
            throw new BadRequestException('User not found');
        }

        return user.id;
    }
}