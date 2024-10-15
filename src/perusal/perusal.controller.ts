import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { CreatePerusal } from './dto/create-perusal.dto';
import { PERUSAL_PAGINATION_CONFIG, PerusalService } from './perusal.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdatePerusal } from './dto/update-perusal.dto';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';

@ApiTags('Perusal (การตรวจ)')
@Controller('perusal')
export class PerusalController {
    constructor(
        private readonly perusalService: PerusalService
    ) { }


    @ApiOperation({ summary: 'ดูข้อมูล การตรวจทั้งหมด' })
    @Get('')
    async findAllPerusal() {
        return this.perusalService.findAll();
    }

    @ApiOperation({ summary: 'สร้าง การตรวจ' })
    @Post('')
    async createPerusal(@Body() createPerusal: CreatePerusal) {
        return this.perusalService.create(createPerusal);
    }

    @ApiOperation({ summary: 'แก้ไข การตรวจ' })
    @Patch('/:id')
    async updatePerusal(@Body() updatePerusal: UpdatePerusal, @Param('id') id: number) {
        return this.perusalService.update(id, updatePerusal);
    }

    @ApiOperation({ summary: 'ดึงข้อมูลการตรวจ' })
    @Get('Pages/:userId')
    @HttpCode(HttpStatus.OK)
    @ApiPaginationQuery(PERUSAL_PAGINATION_CONFIG)
    datatables(@Paginate() query: PaginateQuery, @Param('userId') id: number) {
        return this.perusalService.getPage(query,id);
    }

    @ApiOperation({ summary: 'ลบ การตรวจ' })
    @Delete('/:id')
    async deletePerusal(@Param('id') id: number) {
        return this.perusalService.delete(id);
    }
}
