import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';

@ApiTags('dashboard (แดชบอร์ด)')
@Controller('dashboard')
export class DashboardController {
    constructor(
        private readonly dashboardService: DashboardService,
    ) { }
        @ApiOperation({ summary: 'Dashboard Topwiget' })
        @Get("/topwiget")
        getUsers() {
            return this.dashboardService.dashboardTopWidget();
        }
}
