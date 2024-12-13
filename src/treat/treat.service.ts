import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Treat } from './entity/treat.entity';
import { Repository } from 'typeorm';
import { CreateTreat } from './dto/create-treat.dto';

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
}
