import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { WoundstateService } from './woundstate.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { WoundState } from './entity/woundstate.entity';
import { CreateWoundStateDto } from './dto/create-woundstate.dto';
import { UpdateWoundStateDto } from './dto/update-woundstate.dto';

@ApiTags("WoundState (ระดับความรุนแผล)")
@Controller('woundstate')
export class WoundstateController {
    constructor(
        private readonly woundstateService: WoundstateService
    ) { }

    @ApiOperation({ summary: 'ดึงข้อมูลทั้งหมด ระดับความรุนแผล' })
    @Get('')
    async findAll(): Promise<WoundState[]> {
        return await this.woundstateService.findAll();
    }

    @ApiOperation({ summary: 'ดึงข้อมูลเดียว ระดับความรุนแผล' })
    @Get('/:id')
    async findOne(id: number): Promise<WoundState> {
        return await this.woundstateService.findOne(id);
    }

    @ApiOperation({ summary: 'สร้างข้อมูลระดับความรุนแผล' })
    @Post('')
    async create(@Body() CreateWoundStateDto: CreateWoundStateDto): Promise<WoundState> {
        return await this.woundstateService.create(CreateWoundStateDto);
    }

    @ApiOperation({ summary: 'แก้ไขข้อมูลระดับความรุนแผล' })
    @Patch('/:id')
    async update(@Body() woundstate: UpdateWoundStateDto, @Param('id') id: number): Promise<WoundState> {
        return await this.woundstateService.update(woundstate,id);
    }

    @ApiOperation({ summary: 'ลบข้อมูลระดับความรุนแผล' })
    @Delete('/:id')
    async delete(@Param('id') id: number): Promise<WoundState> {
        return await this.woundstateService.delete(id);
    }

    @ApiOperation({ summary: 'เพิ่มวิธีการรักษาตามระดับความรุนแผล' })
    @Post('/treat/:treatId/:woundStateId')
    async addTreatToWoundState(@Param('treatId') treatId: number, @Param('woundStateId') woundStateId: number): Promise<WoundState> {
        return await this.woundstateService.addTreatToWoundState(treatId, woundStateId);
    }
}
