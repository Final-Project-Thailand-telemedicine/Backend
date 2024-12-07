import { Injectable, NotFoundException } from '@nestjs/common';
import { Wound, WoundArea, WoundStatus } from './entity/wound.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWound } from './dto/create-wound.dto';
import { Perusal } from 'src/perusal/entity/perusal.entity';
import { UpdateWound } from './dto/update-wound.dto';
import { HttpService } from '@nestjs/axios';
import * as FormData from 'form-data';
import { WoundGroupResult } from './wound.types';

@Injectable()
export class WoundService {

    constructor(
        private readonly httpService: HttpService,
        @InjectRepository(Wound)
        private woundRepository: Repository<Wound>,
        @InjectRepository(Perusal)
        private perusalRepository: Repository<Perusal>
    ) { }
    async findAll(): Promise<Wound[]> {
        return await this.woundRepository.find();
    }

    async create(createWound: CreateWound): Promise<Wound> {
        const persual = await this.perusalRepository.findOneBy({ id: createWound.perusal_id });
        if (!persual) throw new NotFoundException();

        const wound = this.woundRepository.create({
            ...createWound,
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

        console.log(queryBuilder);
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
                    mainGroup,
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
        const result = Object.values(groupedWounds)
            .sort((a, b) => {
                // First sort by main group
                if (a.mainGroup !== b.mainGroup) {
                    return a.mainGroup - b.mainGroup;
                }
                // Then sort by count within same main group
                return b.count - a.count;
            });

        return result;
    }

    // Helper method to get wounds grouped by main body areas
    async getWoundsByMainGroups(perusualId?: number) {
        const groupedWounds = await this.groupByWoundArea(perusualId);
        
        const mainGroups = {
            'Head and Neck': groupedWounds.filter(g => g.mainGroup === 0),
            'Upper Extremity': groupedWounds.filter(g => g.mainGroup === 1),
            'Thorax and Abdomen': groupedWounds.filter(g => g.mainGroup === 2),
            'Lower Extremity': groupedWounds.filter(g => g.mainGroup === 3),
            'Other': groupedWounds.filter(g => g.mainGroup === 4),
        };

        return mainGroups;
    }

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
