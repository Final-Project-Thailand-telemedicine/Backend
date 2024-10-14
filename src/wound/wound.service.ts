import { Injectable, NotFoundException } from '@nestjs/common';
import { Wound } from './entity/wound.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWound } from './dto/create-wound.dto';
import { Perusal } from 'src/perusal/entity/perusal.entity';
import { UpdateWound } from './dto/update-wound.dto';

@Injectable()
export class WoundService {

    constructor(
        @InjectRepository(Wound)
        private woundRepository: Repository<Wound>,
        @InjectRepository(Perusal)
        private perusalRepository: Repository<Perusal>
    ) {}
    async findAll(): Promise<Wound[]> {
        return await this.woundRepository.find();
    }

    async create(createWound: CreateWound): Promise<Wound> {
        const persual = await this.perusalRepository.findOneBy({id: createWound.perusal_id});
        if (!persual) throw new NotFoundException();

        const wound = this.woundRepository.create(createWound);
        return await this.woundRepository.save(wound);
    }

    async findOne(id: number): Promise<Wound> {
        return await this.woundRepository.findOneBy({id});
    }

    async updated(id: number, updateWound: UpdateWound): Promise<Wound> {
        const wound = await this.woundRepository.findOneBy({id});
        if (!wound) throw new NotFoundException();

        const persual = await this.perusalRepository.findOneBy({id: updateWound.perusal_id});
        if (!persual) throw new NotFoundException();

        Object.assign(wound, updateWound);

        return await this.woundRepository.save(wound);
        
    }
}
