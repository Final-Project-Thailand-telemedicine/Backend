import { Controller, Delete, Param, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { Helper } from 'src/common/helper';
import { readFileSync } from 'fs-extra';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {

    constructor(
        private readonly uploadService: UploadService
    ) {

    }
    @Post('file')
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'upload file' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary'
                },
            },
        },
    })
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        const buffer: any = readFileSync(file.path)

        const checksum = Helper.generateChecksum(buffer, 'sha256', 'hex');

        file['sha256Checksum'] = checksum

        await this.uploadService.createOne(file);

        const _file: any = file;
        _file.pathUrl = _file.provider == 'local'
            ? process.env.APP_URL + '/' + _file.filename
            : _file.filename;

        return _file;
    }


    @Post('files')
    @UseInterceptors(FilesInterceptor('files'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                files: {
                    type: 'array',
                    items: {
                        type: 'string',
                        format: 'binary',
                    }
                },
            },
        },
    })
    async uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
        for (const file of files) {
            const buffer: any = readFileSync(file.path)

            const checksum = Helper.generateChecksum(buffer, 'sha256', 'hex');

            file['sha256Checksum'] = checksum
        }

        await this.uploadService.createMany(files);

        for (const file of files as any) {
            file.pathUrl = file.provider == 'local'
                ? process.env.APP_URL + '/' + file.filename
                : file.filename;
        }

        return files;
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.uploadService.remove(+id);
    }

    @Post('file_new')
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'upload file new' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary'
                },
            },
        },
    })
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile_new(@UploadedFile() file: Express.Multer.File) {
        const uploadedFile = await this.uploadService.processAndSaveFile(file);
        return uploadedFile;
    }

}
