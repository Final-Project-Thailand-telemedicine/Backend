import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { WoundService } from './wound.service';
import { ApiBody, ApiConsumes, ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { CreateWound } from './dto/create-wound.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { readFileSync } from 'fs-extra';
import { WoundGroupResult } from './wound.types';
import { WoundArea, WoundStatus } from './entity/wound.entity';
import { DiagnosisService } from 'src/diagnosis/diagnosis.service';
import { WoundstateService } from 'src/woundstate/woundstate.service';

@ApiTags("Wound (แผล)")
@Controller('wound')
export class WoundController {

    constructor(
        private readonly woundService: WoundService,
        private readonly diagnosisService: DiagnosisService,
        private readonly woundstateService: WoundstateService,
    ) { }

    @ApiOperation({ summary: 'ดูข้อมูล แผลทั้งหมด' })
    @Get('')
    async findAll() {
        return await this.woundService.findAll();
    }

    @ApiOperation({ summary: 'เพิ่มข้อมูล แผล' })
    @ApiProperty({ type: CreateWound })
    @Post('create')
    async create(@Body() createWound: CreateWound) {
        const wound = await this.woundService.create(createWound);
        console.log(wound);
        const result = await this.woundService.Predict_Model_fromFilePath(wound.wound_image);
        console.log(result);
        const diagnosis = await this.diagnosisService.created({wound_id: wound.id ,nurse_id: null, wound_state: result.wound_state, remark: null});
        console.log(diagnosis);
        return await this.woundstateService.findbyId(result.wound_state);
        
    }

    @ApiOperation({ summary: 'ดูข้อมูล แผล ตาม id' })
    @ApiProperty({ type: Number })
    @Get(':id')
    async findOne(@Param("id") id: number) {
        return await this.woundService.findOne(id);
    }

    @ApiOperation({ summary: 'แก้ไขข้อมูล แผล' })
    @ApiProperty({ type: Number })
    @Patch('/:id')
    async updated(@Body() id: number, @Body() updateWound: CreateWound) {
        return await this.woundService.updated(id, updateWound);
    }

    @ApiOperation({ summary: 'ลบข้อมูล แผล' })
    @Delete('/:id')
    async delete(@Param('id') id: number) {
        return await this.woundService.delete(id);
    }

    @ApiOperation({ summary: 'ดูแผลแยกตาม body area' })
    @ApiProperty({ type: Number })
    @Get('wounds/grouped')
    async getGroupedWounds(): Promise<WoundGroupResult[]> {
        return this.woundService.groupByWoundArea();
    }

    @ApiOperation({ summary: 'ดูแผลแยกตาม body area แยกตาม perusal' })
    @ApiProperty({ type: Number })
    @Get('wounds/grouped/:perusualId')
    async getGroupedWoundsByPerusal(@Param('perusualId') perusualId: number) {
        return this.woundService.groupByWoundArea(perusualId);
    }

    // @ApiOperation({ summary: 'ดูแผลแยกตาม body area แยกตาม perusal แยกตาม main group' })
    // @ApiProperty({ type: Number })
    // @Get('wounds/main-groups/:perusualId')
    // async getWoundsByMainGroups(@Param('perusualId') perusualId: number) {
    //     return this.woundService.getWoundsByMainGroups(perusualId);
    // }

    @ApiOperation({ summary: 'ดูแผลแยกตาม body area แยกตาม perusal' })
    @ApiProperty({ type: Number })
    @Get('wounds/:patientId/:area')
    async getWoundsByWoundarea_perusual(@Param('patientId') patientId: number, @Param('area') area: WoundArea) {
        return this.woundService.getWoundsByWoundareaPatient(patientId, area);
    }

    @ApiOperation({ summary: 'patientId by perusalId' })
    @ApiProperty({ type: Number })
    @Get('patient/:perusualId')
    async getPatientIdByPerusalId(@Param('perusualId') perusualId: number) {
        
        return this.woundService.findPatientIdByPerusalId(perusualId);
    }


    @Post('file')
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'upload wound image' })
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
        console.log(file);

        return await this.woundService.Predict_Model_fromFile(file);
    }

    @ApiOperation({ summary: 'model predict from file path' })
    @Get('predict-model/:path')
    async predictModel(@Param('path') path: string) {
        return await this.woundService.Predict_Model_fromFilePath(path);
    }
}
