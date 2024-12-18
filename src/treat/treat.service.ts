import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Treat } from './entity/treat.entity';
import { Repository } from 'typeorm';
import { CreateTreat } from './dto/create-treat.dto';
import { UpdateTreat } from './dto/update-treat.dto';

@Injectable()
export class TreatService{
    constructor(
        @InjectRepository(Treat)
        private treatRepository: Repository<Treat>,
    ){}

    async findAll(): Promise<Treat[]>{
        return this.treatRepository.find();
    }

    async create(createTreat: CreateTreat): Promise<Treat>{
        const treat = this.treatRepository.create(createTreat);

        return await this.treatRepository.save(treat);
    }

    async delete(id: number): Promise<void> {
        await this.treatRepository.delete(id);
    }

    async findOne(id: number): Promise<Treat> {
        return await this.treatRepository.findOneBy({ id });
    }

    async updated(id: number, updateTreat: UpdateTreat): Promise<Treat> {
        const treat = await this.treatRepository.findOneBy({ id });
        if (!treat) throw new NotFoundException();
        return await this.treatRepository.save({ ...treat, ...updateTreat });
    }
}
