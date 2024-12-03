import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Upload } from './entities/upload.entity';
import { Repository } from 'typeorm';
import { existsSync, unlinkSync,readFileSync } from 'fs-extra';
import { Helper } from 'src/common/helper';

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

        if (!upload) throw new NotFoundException('File not found');
        
        if (existsSync(upload.path)) {
            unlinkSync(upload.path);
        }else throw new NotFoundException('File not found');

        return await this.uploadRepository.delete(id);
    }

    async processAndSaveFile(file: Express.Multer.File): Promise<any> {
        // Read file contents
        const buffer = readFileSync(file.path);

        // Generate checksum
        const checksum = Helper.generateChecksum(buffer, 'sha256', 'hex');
        file['sha256Checksum'] = checksum;

        // Save file information to the database
        await this.uploadRepository.save(file);

        // Generate file path URL
        const _file: any = file;
        _file.pathUrl = _file.provider === 'local'
            ? `${process.env.APP_URL}/${_file.filename}`
            : _file.filename;

        return _file;
    }
}
