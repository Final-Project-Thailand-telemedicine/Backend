import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Wound, WoundArea, WoundStatus } from './entity/wound.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { CreateWound } from './dto/create-wound.dto';
import { Perusal } from 'src/perusal/entity/perusal.entity';
import { UpdateWound } from './dto/update-wound.dto';
import { HttpService } from '@nestjs/axios';
import * as FormData from 'form-data';
import { WoundGroupResult } from './wound.types';
import { User } from 'src/users/entity/user.entity';
import axios from 'axios';
import { DiagnosisService } from 'src/diagnosis/diagnosis.service';
import { WoundstateService } from 'src/woundstate/woundstate.service';
import { Diagnosis } from 'src/diagnosis/entity/diagnosis.entity';
import { WoundState } from 'src/woundstate/entity/woundstate.entity';
import { CreateDiagnosisDTO } from 'src/diagnosis/dto/create-diagnosis.dto';

@Injectable()
export class WoundService {

    constructor(
        private readonly dataSource: DataSource,
        private readonly httpService: HttpService,
        private readonly diagnosisService: DiagnosisService,
        private readonly woundstateService: WoundstateService,
        @InjectRepository(Wound)
        private woundRepository: Repository<Wound>,
        @InjectRepository(Perusal)
        private perusalRepository: Repository<Perusal>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Diagnosis)
        private diagnosisRepository: Repository<Diagnosis>,
        @InjectRepository(WoundState)
        private woundstateRepository: Repository<WoundState>,
    ) { }
    async findAll(): Promise<Wound[]> {
        return await this.woundRepository.find();
    }

    async findPatientIdByPerusalId(perusalId: number) {
        const PatientId = await this.userRepository.findOneBy({ perusal: { id: perusalId } });

        return PatientId.id;
    }

    async createWoundWithDiagnosis(createWound: CreateWound) {
        const queryRunner = this.dataSource.createQueryRunner();
    
        await queryRunner.connect();
        await queryRunner.startTransaction();
    
        try {
            // Step 1: Wound creation using the existing service
            const persual = await queryRunner.manager.findOne(Perusal, { where: { id: createWound.perusal_id } });
            if (!persual) throw new NotFoundException();
    
            const patientId = await this.findPatientIdByPerusalId(createWound.perusal_id);
    
            const user = await queryRunner.manager.findOne(User, {
                where: { id: patientId },
                relations: ['perusal', 'perusal.wound'],
            });
    
            if (!user) throw new NotFoundException(`User with ID ${patientId} not found`);
    
            const allWounds = user.perusal.flatMap(perusal =>
                perusal.wound.map(wound => ({ ...wound, perusal_id: perusal.id }))
            );
    
            const sortedWounds = allWounds.sort((a, b) => b.count - a.count);
    
            let count = 0;
            let woundRefValue: number | null = null;
    
            if (createWound.wound_type === 'แผลเก่า') {
                if (!createWound.wound_ref) {
                    throw new BadRequestException('wound_ref is required for "แผลเก่า"');
                }
                woundRefValue = createWound.wound_ref;
                console.log(sortedWounds);
                
                const fillter_woundref = sortedWounds.filter(wound => wound.wound_ref === woundRefValue || wound.id === woundRefValue);
                if (fillter_woundref.length > 0) {
                    
                    count = fillter_woundref[0].count;
                } else {
                    throw new BadRequestException('count is wrong at "แผลเก่า"');
                }
            } else {
                count = sortedWounds.length > 0 ? sortedWounds[0].count + 1 : 1;
            }
    
            const wound = queryRunner.manager.create(Wound, {
                ...createWound,
                count: count,
                wound_ref: woundRefValue,
                perusal: persual,
            });
    
            const savedWound = await queryRunner.manager.save(Wound, wound);
    
            // Step 2: Prediction logic
            const result = await this.Predict_Model_fromFilePath(savedWound.wound_image);
            if (!result || !result.wound_state) {
                throw new BadRequestException('Prediction failed or wound state not returned.');
            }
    
            // Step 3: Diagnosis creation using the existing service
            const createDiagnosisDTO: CreateDiagnosisDTO = {
                wound_id: savedWound.id,
                nurse_id: null,
                wound_state: result.wound_state,
                remark: null,
            };
    
            const diagnosis = await this.diagnosisService.created(createDiagnosisDTO, queryRunner);
    
            // Step 4: Fetch WoundState details using the existing service
            const woundStateDetails = await this.woundstateService.findbyId(result.wound_state);
    
            // Commit the transaction
            await queryRunner.commitTransaction();
    
            return diagnosis;
        } catch (error) {
            // Rollback transaction on error
            await queryRunner.rollbackTransaction();
            console.error('Transaction rolled back due to error:', error.message);
            throw error;
        } finally {
            // Release queryRunner
            await queryRunner.release();
        }
    }
    
    
    // async create(createWound: CreateWound): Promise<Wound> {
    //     const persual = await this.perusalRepository.findOneBy({ id: createWound.perusal_id });
    //     if (!persual) throw new NotFoundException();

    //     const patientId = await this.findPatientIdByPerusalId(createWound.perusal_id);

    //     const user = await this.userRepository.findOne({
    //         where: { id: patientId },
    //         relations: ['perusal', 'perusal.wound'],
    //     });

    //     if (!user) {
    //         throw new NotFoundException(`User with ID ${patientId} not found`);
    //     }

    //     var allWounds = user.perusal.flatMap(perusal =>
    //         perusal.wound.map(wound => ({ ...wound, perusal_id: perusal.id }))
    //     );

    //     if (createWound.wound_type === 'แผลเก่า') {
    //         allWounds = allWounds.filter(wound => !createWound.wound_ref || wound.wound_ref === createWound.wound_ref || wound.id === createWound.wound_ref);
    //     }

    //     const sortedWounds = allWounds.sort((a, b) => b.count - a.count);

    //     let count = 0;

    //     let woundRefValue: number | null = null;
    //     if (createWound.wound_type === 'แผลเก่า') {
    //         if (!createWound.wound_ref) {
    //             throw new BadRequestException('wound_ref is required for "แผลเก่า"');
    //         }
    //         woundRefValue = createWound.wound_ref;
    //         if (sortedWounds.length > 0) {
    //             count = sortedWounds[0].count;
    //         } else {
    //             throw new BadRequestException('count is wrong at "แผลเก่า"');
    //         }
    //     } else {
    //         if (sortedWounds.length > 0) {
    //             count = sortedWounds[0].count + 1;
    //         } else {
    //             count = 1
    //         }
    //     }

    //     const wound = this.woundRepository.create({
    //         ...createWound,
    //         count: count,
    //         wound_ref: woundRefValue, // Override wound_ref value
    //         perusal: persual
    //     });

    //     const result = await this.woundRepository.save(wound);
    //     //return lastest woundId

    //     return result;
    // }

    async Predict_Model_fromFilePath(imageUrl: string) {
        const formData = new FormData();

        // Fetch the file from the URL
        const response = await axios.get(process.env.BASE_URL + imageUrl, { responseType: 'stream' });
        formData.append('file', response.data);

        const headers = {
            ...formData.getHeaders(),
        };

        // Send the form data to the prediction service
        const predictionResponse = await this.httpService.axiosRef.post(
            'http://127.0.0.1:8080/uploadfile/',
            formData,
            { headers }
        );

        return predictionResponse.data;
    }

    async findOne(id: number): Promise<Wound> {
        return await this.woundRepository.findOneBy({ id });
    }

    async updated(id: number, updateWound: UpdateWound): Promise<Wound> {
        const wound = await this.woundRepository.findOneBy({ id });
        if (!wound) throw new NotFoundException();

        const persual = await this.perusalRepository.findOneBy({ id: updateWound.perusal_id });
        if (!persual) throw new NotFoundException();

        Object.assign(wound, updateWound);

        return await this.woundRepository.save(wound);

    }

    async delete(id: number): Promise<Wound> {
        const wound = await this.woundRepository.findOneBy({ id });
        if (!wound) throw new NotFoundException();
    
        const diagnosis = await this.diagnosisRepository.find({ where: { wound: { id: id } } });
        if (diagnosis.length > 0) {
            await this.diagnosisRepository.softRemove(diagnosis);
        }
    
        return await this.woundRepository.softRemove(wound);
    }

    async groupByWoundArea(perusualId?: number): Promise<WoundGroupResult[]> {
        // Build query
        const queryBuilder = this.woundRepository
            .createQueryBuilder('wound')

        // Add perusal filter if ID is provided
        if (perusualId) {
            queryBuilder.where('wound.perusal_id = :perusualId', { perusualId });
        }

        const wounds = await queryBuilder.getMany();


        // Group wounds by area
        const groupedWounds = wounds.reduce((acc, wound) => {
            const area = wound.area;

            // Extract main group number from area enum (first number in Type_X_Y)
            const mainGroup = parseInt(area.split('_')[1]);

            if (!acc[area]) {
                acc[area] = {
                    area,
                    wounds: [],
                    count: 0,
                    persual_id: perusualId,
                    statusBreakdown: {
                        [WoundStatus.Pending]: 0,
                        [WoundStatus.Done]: 0,
                        [WoundStatus.Canceled]: 0
                    }
                };
            }

            acc[area].wounds.push(wound);
            acc[area].count++;
            acc[area].statusBreakdown[wound.status]++;

            return acc;
        }, {} as Record<string, WoundGroupResult>);

        // Convert to array and sort
        console.log(groupedWounds);

        const result = Object.values(groupedWounds)

        return result;
    }

    async getWoundsByWoundareaPatient(patientId: number, area?: WoundArea) {

        const user = await this.userRepository.findOne({
            where: { id: patientId },
            relations: ['perusal', 'perusal.wound'],
        });

        if (!user) {
            throw new NotFoundException(`User with ID ${patientId} not found`);
        }

        const allWounds = user.perusal.flatMap(perusal =>
            perusal.wound.map(wound => ({ ...wound, perusal_id: perusal.id }))
        );


        const filteredWounds = allWounds.filter(wound => !area || wound.area === area);


        const woundMap = new Map<number, any>();

        // Process wounds to select the latest wound for each wound_ref
        filteredWounds.forEach(wound => {
            if (wound.wound_ref) {
                // If there's a wound_ref, check if the map already contains a wound for this reference
                const existing = woundMap.get(wound.wound_ref);
                if (!existing || new Date(wound.updatedAt) > new Date(existing.updatedAt)) {
                    woundMap.set(wound.wound_ref, wound);
                }
            } else {
                // If no wound_ref, store the wound in the map using its own id
                woundMap.set(wound.id, wound);
            }
        });

        // Prepare the result: include only the latest wounds for each wound_ref
        const result = Array.from(woundMap.values()).filter(wound => {
            // Include only the latest wound for each wound_ref or standalone wounds
            return !wound.wound_ref || woundMap.get(wound.wound_ref).id === wound.id;
        });

        return result;
    }

    async Predict_Model_fromFile(file: Express.Multer.File) {
        const formData = new FormData();
        formData.append('file', file.buffer, {
            filename: file.originalname,
            contentType: file.mimetype,
        });

        const response = await this.httpService.axiosRef.post(
            'http://127.0.0.1:8080/uploadfile/',
            formData,
            { headers: formData.getHeaders() }
        );

        return response.data;
    }

    async showLatestWounds(patientId: number) {
        const user = await this.userRepository.findOne({
            where: { id: patientId },
            relations: ['perusal', 'perusal.wound'],
        });

        if (!user) {
            throw new NotFoundException(`User with ID ${patientId} not found`);
        }

        const allWounds = user.perusal.flatMap(perusal =>
            perusal.wound.map(wound => ({ ...wound, perusal_id: perusal.id }))
        );

        const latestUniqueWounds = Object.values(
            allWounds.reduce((acc, wound) => {
                const { count } = wound;
                if (!acc[count] || new Date(wound.updatedAt) > new Date(acc[count].updatedAt)) {
                    acc[count] = wound;
                }
                return acc;
            }, {} as Record<number, typeof allWounds[0]>)
        );
    
        return latestUniqueWounds;
    }

    async followupByWoundId(woundId: number) {
        const wound = await this.woundRepository.findOneBy({ id: woundId });
        if (!wound) throw new NotFoundException();
        const wounds = await this.woundRepository.find({ where: { count: wound.count } });
        return wounds;
    }
}
