import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TreatService } from './treat.service';
import { CreateTreat } from './dto/create-treat.dto';

@ApiTags('treat (การดูแล)')
@Controller('treat')
export class TreatController {
    constructor(
        private readonly treatService: TreatService
    ) { }

    @ApiOperation({ summary: 'สร้าง การดูแล' })
    @Post('')
    async CreateTreat(@Body() createTreat: CreateTreat) {
        return this.treatService.create(createTreat);
    }
}
