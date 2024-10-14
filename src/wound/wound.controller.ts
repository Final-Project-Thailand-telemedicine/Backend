import { Body, Controller, Get, Post } from '@nestjs/common';
import { WoundService } from './wound.service';
import { ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { CreateWound } from './dto/create-wound.dto';

@ApiTags("Wound (แผล)")
@Controller('wound')
export class WoundController {

    constructor(
        private readonly woundService: WoundService
    ) {}

    @ApiOperation({ summary: 'ดูข้อมูล แผลทั้งหมด' })
    @Get('')
    async findAll() {
        return await this.woundService.findAll();
    }

    @ApiOperation({ summary: 'เพิ่มข้อมูล แผล' })
    @ApiProperty({ type: CreateWound })
    @Post('create')
    async create(@Body() createWound: CreateWound) {
        return await this.woundService.create(createWound);
    }

    @ApiOperation({ summary: 'ดูข้อมูล แผล ตาม id' })
    @ApiProperty({ type: Number })
    @Get(':id')
    async findOne(@Body() id: number) {
        return await this.woundService.findOne(id);
    }

    @ApiOperation({ summary: 'แก้ไขข้อมูล แผล' })
    @ApiProperty({ type: Number })
    @Post('update/:id')
    async updated(@Body() id: number, @Body() updateWound: CreateWound) {
        return await this.woundService.updated(id, updateWound);
    }
}
