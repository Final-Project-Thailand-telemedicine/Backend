import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Diagnosis } from './entity/diagnosis.entity';
import { In, QueryRunner, Repository } from 'typeorm';
import { CreateDiagnosisDTO } from './dto/create-diagnosis.dto';
import { User } from 'src/users/entity/user.entity';
import { Wound, WoundStatus } from 'src/wound/entity/wound.entity';
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
        // Check if the diagnosis exists
        const diagnosis = await this.diagnosisRepository.findOne({
            where: { id },
            relations: ['wound'],
        });
        
        if (diagnosis) {

            const wound = await this.woundRepository.findOne({ where: { id: diagnosis.wound.id } });
            
            if (wound) {
                await this.woundRepository.update(wound.id, { status: WoundStatus.Done });
            }

            if(updateDiagnosis.wound_state) {
                const woundState = await this.woundstateRepository.findOne({ where: { id: updateDiagnosis.wound_state } });
                if (!woundState) {
                    throw new NotFoundException(`Wound state with ID ${updateDiagnosis.wound_state} not found.`);
                }
                await this.diagnosisRepository.update(id, { woundstate: woundState });
            }

            if(updateDiagnosis.remark) {
                await this.diagnosisRepository.update(id, { remark: updateDiagnosis.remark });
            }
            return { id, ...updateDiagnosis };
        } else {
            throw new NotFoundException(`Diagnosis with ID ${id} not found.`);
        }
    }
    

    async delete(id: number) {
        return await this.diagnosisRepository.delete({ id });
    }

    async findByWoundId(woundId: number) {
        const diagnosis = await this.diagnosisRepository.find({
            where: { wound: { id: woundId } },
            relations: ['wound.perusal.user', 'nurse', 'woundstate'],
        });

        const woundstate = await this.woundstateRepository.find({
            where: { id: diagnosis[0].woundstate.id },
            relations: ['treat'],
        })

        const result = {
            diagnosis_id: diagnosis[0].id,
            patient_id: diagnosis[0].wound.perusal.user.id,
            persual_id: diagnosis[0].wound.perusal.id,
            wound_image: diagnosis[0].wound.wound_image,
            wound_status: diagnosis[0].wound.status,
            count: diagnosis[0].wound.count,
            remark: diagnosis[0].remark,
            ...woundstate[0],
        }

        return result;
    }

}
