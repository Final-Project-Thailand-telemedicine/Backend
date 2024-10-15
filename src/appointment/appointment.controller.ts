import { Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppointmentService } from './appointment.service';

@ApiTags("Appointment (การนัดหมาย)")
@Controller('appointment')
export class AppointmentController {
    constructor(
        private readonly appointmentService: AppointmentService
    ) { }

    @ApiOperation({ summary: 'ดูรายการนัดหมายทั้งหมด' })
    @Get()
    findAll() {
        return this.appointmentService.findAll();
    }

    @ApiOperation({ summary: 'สร้างการนัดหมายใหม่' })
    @Post('create')
    created() {
        return this.appointmentService.created();
    }

    @ApiOperation({ summary: 'แก้ไขการนัดหมาย' })
    @Patch('update')
    updated() {
        return this.appointmentService.updated();
    }

    @ApiOperation({ summary: 'ลบการนัดหมาย' })
    @Delete('delete')
    delete() {
        return this.appointmentService.delete();
    }

}
