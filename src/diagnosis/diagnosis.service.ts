import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Diagnosis } from './entity/diagnosis.entity';
import { In, QueryRunner, Repository } from 'typeorm';
import { CreateDiagnosisDTO } from './dto/create-diagnosis.dto';
import { User } from 'src/users/entity/user.entity';
import { Wound } from 'src/wound/entity/wound.entity';
import { UpdateDiagnosisDto } from './dto/update-diagnosis.dto';
import { WoundState } from 'src/woundstate/entity/woundstate.entity';

@Injectable()
export class DiagnosisService {

    constructor(
        @InjectRepository(Diagnosis)
        private diagnosisRepository: Repository<Diagnosis>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Wound)
        private woundRepository: Repository<Wound>,
        @InjectRepository(WoundState)
        private woundstateRepository: Repository<WoundState>,
    ) { }

    async findAll(): Promise<Diagnosis[]> {
        return await this.diagnosisRepository.find()
    }

    async created(createDiagnosis: CreateDiagnosisDTO, queryRunner: QueryRunner) {
        console.log('debug createDiagnosis:', createDiagnosis);
    
        // Use queryRunner.manager for transaction context
        const wound = await queryRunner.manager.findOne(Wound, { where: { id: createDiagnosis.wound_id } });
        if (!wound) {
            throw new NotFoundException(`Wound with ID ${createDiagnosis.wound_id} not found.`);
        }
    
        let nurse = null;
        if (createDiagnosis.nurse_id) {
            nurse = await queryRunner.manager.findOne(User, { where: { id: createDiagnosis.nurse_id } });
            if (!nurse) {
                throw new NotFoundException(`Nurse with ID ${createDiagnosis.nurse_id} not found.`);
            }
        }
    
        const woundState = await queryRunner.manager.findOne(WoundState, { where: { id: createDiagnosis.wound_state } });
        if (!woundState) {
            throw new NotFoundException(`Wound state with ID ${createDiagnosis.wound_state} not found.`);
        }
    
        const diagnosis = queryRunner.manager.create(Diagnosis, {
            wound,
            nurse,
            woundstate: woundState,
            remark: createDiagnosis.remark,
        });
    
        console.log('debug diagnosis entity before save:', diagnosis);
    
        // Save and return the entity using the transaction context
        return await queryRunner.manager.save(Diagnosis, diagnosis);
    }

    async updated(updateDiagnosis: UpdateDiagnosisDto, id: number) {
        const diagnosis = await this.diagnosisRepository.findOneBy({ id });
        if (!diagnosis) throw new NotFoundException();
        return await this.diagnosisRepository.save({ ...diagnosis, ...updateDiagnosis });
    }

    async delete(id: number) {
        return await this.diagnosisRepository.delete({ id });
    }

    async findByWoundId(woundId: number) {
        const diagnosis = await this.diagnosisRepository.find({
            where: { wound: { id: woundId } },
            relations: ['wound.perusal', 'nurse', 'woundstate'],
        });
        
        const woundstate = await this.woundstateRepository.find({
            where: { id: diagnosis[0].woundstate.id },
            relations: ['treat'],
        })

        const result ={
            persual_id: diagnosis[0].wound.perusal.id,
            wound_image: diagnosis[0].wound.wound_image,
            ...woundstate[0],
        }


        return result;
    }

}
