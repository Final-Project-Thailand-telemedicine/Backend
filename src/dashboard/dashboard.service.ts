import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Diagnosis } from 'src/diagnosis/entity/diagnosis.entity';
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
        @InjectRepository(Diagnosis)
        private diagnosisRepository: Repository<Diagnosis>,
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

    async dashboardMiddleWidget() {
        const diagnoses = await this.diagnosisRepository.find({ relations: ['woundstate'] });

        // Initialize dataset
        const woundLevels = [1, 2, 3, 4];
        const monthlyData = woundLevels.map(level => ({
            name: `แผลกดทับระดับที่ ${level}`,
            type: 'line',
            color: this.getColorByLevel(level),
            data: new Array(12).fill(0),
        }));

        // Process data
        diagnoses.forEach(diagnosis => {
            const monthIndex = new Date(diagnosis.createdAt).getMonth();
            const state = diagnosis.woundstate.state;
            const series = monthlyData.find(series => series.name.includes(`ระดับที่ ${state}`));
            if (series) {
                series.data[monthIndex]++;
            }
        });

        return monthlyData;
    }

    private getColorByLevel(level: number): string {
        const colors = {
            1: '#FF0000',
            2: '#DC143C',
            3: '#800000',
            4: '#FF2400',
        };
        return colors[level] || '#000000';
    }

}
