import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Upload } from './entities/upload.entity';
import { Repository } from 'typeorm';
import { existsSync, unlinkSync } from 'fs-extra';

@Injectable()
export class UploadService {
    constructor(
        @InjectRepository(Upload)
        private uploadRepository: Repository<Upload>,
    ) { }

    createOne(dto: any) {
        return this.uploadRepository.save(dto);
    }

    createMany(dto: any) {
        return this.uploadRepository.insert(dto);
    }

    async remove(id: number) {
        const upload = await this.uploadRepository.findOneBy({ id });

        if (!upload) throw new Error('File not found');
        
        if (existsSync(upload.path)) {
            unlinkSync(upload.path);
        }else throw new Error('File not found');

        return await this.uploadRepository.delete(id);
    }
}
