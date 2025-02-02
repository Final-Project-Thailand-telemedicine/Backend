import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Perusal } from 'src/perusal/entity/perusal.entity';
import { Role } from 'src/roles/entity/role.entity';
import { PatientNurse } from 'src/users/entity/patientnurse.entity';
import { User } from 'src/users/entity/user.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class DashboardService {
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

    async countPatients() {
        const countpatient = this.userRepository.count({
            where: { role: { id: 2 } },
            relations: ["role"],
        });

        return countpatient;
    }

    async countPatientsinNurse(): Promise<number> {
        const records = await this.patientNurseRepository.find({
            select: ["patient_id"],
        });

        const uniquePatients = new Set(records.map(record => record.patient_id));

        return uniquePatients.size;
    }

    async dashboardTopWidget() {
        const countpatient = await this.countPatients();
        const countpatientInNurse = await this.countPatientsinNurse();
        const countpatientOutNurse = countpatient - countpatientInNurse;

        return {
            "countpatient": countpatient,
            "countpatientInNurse": countpatientInNurse,
            "countpatientOutNurse": countpatientOutNurse,
        }
    }

}
