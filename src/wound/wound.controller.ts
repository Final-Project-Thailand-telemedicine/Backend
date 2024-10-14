import { Controller, Get } from '@nestjs/common';
import { WoundService } from './wound.service';
import { ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';

@ApiTags("Wound")
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
}
