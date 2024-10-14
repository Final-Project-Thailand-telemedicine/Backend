import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Perusal } from './entity/perusal.entity';
import { CreatePerusal } from './dto/create-perusal.dto';
import { UpdatePerusal } from './dto/update-perusal.dto';
import { paginate, PaginateConfig, Paginated, PaginateQuery } from 'nestjs-paginate';


export const PERUSAL_PAGINATION_CONFIG: PaginateConfig<Perusal> = {
    sortableColumns: ['id', 'perusal_date'],
    select: ['id', 'perusal_date', 'createdAt'],
};
@Injectable()
export class PerusalService {
    constructor(
        @InjectRepository(Perusal)
        private perusalRepository: Repository<Perusal>,
    ) { }

    async findAll(): Promise<Perusal[]> {
        return await this.perusalRepository.find();
    }


    async getPage(query: PaginateQuery,id:number): Promise<Paginated<Perusal>> {

        const queryBuilder = this.perusalRepository.createQueryBuilder('perusal')
        .where('perusal.user = :id', { id });
        return paginate(query, queryBuilder || this.perusalRepository, PERUSAL_PAGINATION_CONFIG);
    }

    async create(createPerusal: CreatePerusal): Promise<Perusal> {
        const { perusal_date, patient_id } = createPerusal;

        if (!perusal_date || !patient_id) {
            throw new BadRequestException('request not correct');
        }
        const perusal = this.perusalRepository.create({
            perusal_date,
            user: { id: patient_id }
        })

        return await this.perusalRepository.save(perusal);
    }

    async update(id: number, updatePerusal: UpdatePerusal): Promise<Perusal> {
        const { perusal_date, patient_id } = updatePerusal;
        const perusal = await this.perusalRepository.findOne({ where: { id } });

        if (!perusal) {
            throw new NotFoundException('perusal not found');
        }

        if (perusal_date) perusal.perusal_date = perusal_date;
        if (patient_id) perusal.user.id = patient_id;

        return await this.perusalRepository.save(perusal);
    }

    async delete(id: number): Promise<Perusal> {
        const perusal = await this.perusalRepository.findOne({ where: { id } });
        if (!perusal) {
            throw new NotFoundException('perusal not found');
        }
        return await this.perusalRepository.remove(perusal);
    }
}
