import { Controller, Get } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('seeder')
export class SeederController {

    constructor(
        private readonly seederService: SeederService
    ) { }

    @ApiOperation({ summary: 'Seed Mock Data' })
    @Get()
    getUsers() {
        return this.seederService.seed();
    }
}
