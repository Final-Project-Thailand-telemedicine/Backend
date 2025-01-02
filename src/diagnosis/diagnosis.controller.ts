import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { DiagnosisService } from './diagnosis.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateDiagnosisDTO } from './dto/create-diagnosis.dto';
import { UpdateDiagnosisDto } from './dto/update-diagnosis.dto';

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
    @Post('')
    created(@Body() createDiagnosis: CreateDiagnosisDTO) {
        // return this.diagnosisService.created(createDiagnosis);
    }

    @ApiOperation({ summary: 'แก้ไขข้อมูล การรักษา' })
    @Patch('/:id')
    updated(@Body() updateDiagnosis: UpdateDiagnosisDto ,@Param('id') id: number) {
        return this.diagnosisService.updated(updateDiagnosis ,id);
    }

    @ApiOperation({ summary: 'ลบข้อมูล การรักษา' })
    @Delete('/:id')
    delete(@Param('id') id: number) {
        return this.diagnosisService.delete(id);
    }

    @ApiOperation({ summary: 'ดูข้อมูล การรักษา' })
    @Get('/wound/:woundId')
    findByWoundId(@Param('woundId') woundId: number) {
        return this.diagnosisService.findByWoundId(woundId);
    }
}
