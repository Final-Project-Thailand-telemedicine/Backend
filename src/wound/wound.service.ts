import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Wound, WoundArea, WoundStatus } from './entity/wound.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWound } from './dto/create-wound.dto';
import { Perusal } from 'src/perusal/entity/perusal.entity';
import { UpdateWound } from './dto/update-wound.dto';
import { HttpService } from '@nestjs/axios';
import * as FormData from 'form-data';
import { WoundGroupResult } from './wound.types';
import { User } from 'src/users/entity/user.entity';
import { log } from 'node:console';

@Injectable()
export class WoundService {

    constructor(
        private readonly httpService: HttpService,
        @InjectRepository(Wound)
        private woundRepository: Repository<Wound>,
        @InjectRepository(Perusal)
        private perusalRepository: Repository<Perusal>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }
    async findAll(): Promise<Wound[]> {
        return await this.woundRepository.find();
    }

    async findPatientIdByPerusalId(perusalId: number) {
        const PatientId = await this.userRepository.findOneBy({ perusal: { id: perusalId } });

        return PatientId.id;
    }

    async create(createWound: CreateWound): Promise<Wound> {
        const persual = await this.perusalRepository.findOneBy({ id: createWound.perusal_id });
        if (!persual) throw new NotFoundException();

        const patientId = await this.findPatientIdByPerusalId(createWound.perusal_id);

        const user = await this.userRepository.findOne({
            where: { id: patientId },
            relations: ['perusal', 'perusal.wound'],
        });

        if (!user) {
            throw new NotFoundException(`User with ID ${patientId} not found`);
        }

        var allWounds = user.perusal.flatMap(perusal =>
            perusal.wound.map(wound => ({ ...wound, perusal_id: perusal.id }))
        );

        if (createWound.wound_type === 'แผลเก่า') {
            allWounds = allWounds.filter(wound => !createWound.wound_ref || wound.wound_ref === createWound.wound_ref || wound.id === createWound.wound_ref);
        }

        const sortedWounds = allWounds.sort((a, b) => b.count - a.count);

        console.log(sortedWounds);


        let count = 0;

        let woundRefValue: number | null = null;
        if (createWound.wound_type === 'แผลเก่า') {
            if (!createWound.wound_ref) {
                throw new BadRequestException('wound_ref is required for "แผลเก่า"');
            }
            woundRefValue = createWound.wound_ref;
            if (sortedWounds.length > 0) {
                count = sortedWounds[0].count;
            } else {
                throw new BadRequestException('count is wrong at "แผลเก่า"');
            }
        } else {
            if (sortedWounds.length > 0) {
                count = sortedWounds[0].count + 1;
            } else {
                count = 1
            }
        }

        const wound = this.woundRepository.create({
            ...createWound,
            count: count,
            wound_ref: woundRefValue, // Override wound_ref value
            perusal: persual
        });
        return await this.woundRepository.save(wound);
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
        return await this.woundRepository.remove(wound);
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


    // async getWoundsByMainGroups(perusualId?: number) {
    //     const groupedWounds = await this.groupByWoundArea(perusualId);

    //     const mainGroups = {
    //         'Head and Neck': groupedWounds.filter(g => g.mainGroup === 0),
    //         'Upper Extremity': groupedWounds.filter(g => g.mainGroup === 1),
    //         'Thorax and Abdomen': groupedWounds.filter(g => g.mainGroup === 2),
    //         'Lower Extremity': groupedWounds.filter(g => g.mainGroup === 3),
    //         'Other': groupedWounds.filter(g => g.mainGroup === 4),
    //     };

    //     return mainGroups;
    // }

    async Predict_Model(file: Express.Multer.File) {
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
}
