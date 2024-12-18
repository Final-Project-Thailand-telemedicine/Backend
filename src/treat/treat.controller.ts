import { Body, Controller, Delete, Get, Patch, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TreatService } from './treat.service';
import { CreateTreatDTO } from './dto/create-treat.dto';
import { UpdateTreatDTO } from './dto/update-treat.dto';

@ApiTags('treat (การดูแล)')
@Controller('treat')
export class TreatController {
    constructor(
        private readonly treatService: TreatService
    ) { }

    @ApiOperation({ summary: 'สร้าง การดูแล' })
    @Post('')
    async CreateTreat(@Body() createTreat: CreateTreatDTO) {
        return this.treatService.create(createTreat);
    }

    @ApiOperation({ summary: 'แก้ไข การดูแล' })
    @Patch('/:id')
    async UpdateTreat(@Body() updateTreat: UpdateTreatDTO, @Body('id') id: number) {
        return this.treatService.updated(id, updateTreat);
    }

    @ApiOperation({ summary: 'ลบ การดูแล' })
    @Delete('/:id')
    async DeleteTreat(@Body('id') id: number) {
        return this.treatService.delete(id);
    }

    @ApiOperation({ summary: 'ดึงข้อมูล การดูแล' })
    @Get('/:id')
    async FindTreat(@Body('id') id: number) {
        return this.treatService.findOne(id);
    }

    @ApiOperation({ summary: 'ดึงข้อมูล การดูแลทั้งหมด' })
    @Get('')
    async FindAllTreat() {
        return this.treatService.findAll();
    }
}
