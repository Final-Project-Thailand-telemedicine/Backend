import { Injectable, NotFoundException } from '@nestjs/common';
import { WoundState } from './entity/woundstate.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { CreateWoundStateDto } from './dto/create-woundstate.dto';
import { UpdateWoundStateDto } from './dto/update-woundstate.dto';
import { Treat } from 'src/treat/entity/treat.entity';

@Injectable()
export class WoundstateService {
    constructor(
        @InjectRepository(WoundState)
        private woundstateRepository: Repository<WoundState>,
        @InjectRepository(Treat)
        private treatRepository: Repository<Treat>,
    ) { }

    async findAll(): Promise<WoundState[]> {
        return await this.woundstateRepository.find(
            {
                relations: ['treat'],
            },
        );
    }

    async findOne(id: number): Promise<WoundState> {
        return await this.woundstateRepository.findOneBy({ id });
    }

    async findbyId(id: number): Promise<WoundState[]> {
        const woundstate = await this.woundstateRepository.find({
            where: { id: id },
            relations: ['treat'],
        });
        return woundstate;

    }

    async create(CreateWoundStateDto: CreateWoundStateDto): Promise<WoundState> {
        return await this.woundstateRepository.save(CreateWoundStateDto);
    }

    async update(woundstate: UpdateWoundStateDto, id: number): Promise<WoundState> {
        await this.woundstateRepository.update(id, woundstate);
        return await this.woundstateRepository.findOneBy({ id });
    }

    async delete(id: number): Promise<WoundState> {
        return await this.woundstateRepository.remove(await this.findOne(id));
    }

    async addTreatToWoundState(treatId: number, woundStateId: number): Promise<WoundState> {
        const woundState = await this.woundstateRepository.findOne({
            where: { id: woundStateId },
            relations: ['treat'],
        })

        if (!woundState) throw new NotFoundException('WoundState not found');

        const treat = await this.treatRepository.findOne({ where: { id: treatId } });
        if (!treat) throw new NotFoundException('Treat not found');

        if (woundState.treat.some(existingTreat => existingTreat.id === treat.id)) {
            return woundState;
        }

        woundState.treat.push(treat);
        return await this.woundstateRepository.save(woundState);
    }
}
