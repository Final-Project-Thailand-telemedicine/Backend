import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Diagnosis } from './entity/diagnosis.entity';
import { In, Repository } from 'typeorm';
import { CreateDiagnosisDTO } from './dto/create-diagnosis.dto';
import { User } from 'src/users/entity/user.entity';
import { Wound } from 'src/wound/entity/wound.entity';
import { UpdateDiagnosisDto } from './dto/update-diagnosis.dto';

@Injectable()
export class DiagnosisService {

    constructor(
        @InjectRepository(Diagnosis)
        private diagnosisRepository: Repository<Diagnosis>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Wound)
        private woundRepository: Repository<Wound>,
    ) { }

    async findAll(): Promise<Diagnosis[]> {
        return await this.diagnosisRepository.find()
    }

    async created(createDiagnosis: CreateDiagnosisDTO) {
        const user = await this.userRepository.findOneBy({ id: createDiagnosis.nurse_id });
        if (!user) throw new NotFoundException();

        const wound = await this.woundRepository.findOneBy({ id: createDiagnosis.wound_id });
        if (!wound) throw new NotFoundException();

        return await this.diagnosisRepository.save(createDiagnosis);
    }

    async updated(updateDiagnosis: UpdateDiagnosisDto, id: number) {
        const diagnosis = await this.diagnosisRepository.findOneBy({ id });
        if (!diagnosis) throw new NotFoundException();
        return await this.diagnosisRepository.save({ ...diagnosis, ...updateDiagnosis });
    }

    async delete(id:number) {
        return await this.diagnosisRepository.delete({id});
    }
}
