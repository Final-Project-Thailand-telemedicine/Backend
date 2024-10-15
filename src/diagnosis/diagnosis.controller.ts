import { Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { DiagnosisService } from './diagnosis.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Diagnosis (การรักษา)')
@Controller('diagnosis')
export class DiagnosisController {
    constructor(
        private readonly diagnosisService: DiagnosisService
    ) { }

    @ApiOperation({ summary: 'ดูข้อมูล การรักษาทั้งหมด' })
    @Get('')
    findAll() {
        return this.diagnosisService.findAll();
    }

    @ApiOperation({ summary: 'สร้างข้อมูล การรักษา' })
    @Post('created')
    created() {
        return this.diagnosisService.created();
    }

    @ApiOperation({ summary: 'แก้ไขข้อมูล การรักษา' })
    @Patch('updated')
    updated() {
        return this.diagnosisService.updated();
    }

    @ApiOperation({ summary: 'ลบข้อมูล การรักษา' })
    @Delete('delete')
    delete() {
        return this.diagnosisService.delete();
    }
}
