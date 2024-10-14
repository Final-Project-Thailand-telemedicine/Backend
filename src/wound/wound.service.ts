import { Injectable } from '@nestjs/common';
import { Wound } from './entity/wound.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class WoundService {

    constructor(
        @InjectRepository(Wound)
        private woundRepository: Repository<Wound>
    ) {}
    async findAll(): Promise<Wound[]> {
        return await this.woundRepository.find();
    }
}
