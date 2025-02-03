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

        @ApiOperation({ summary: 'Dashboard Middlewiget' })
        @Get("/middlewiget")
        getMiddleWidget() {
            return this.dashboardService.dashboardMiddleWidget();
        }

        @ApiOperation({ summary: 'Dashboard Middlewiget2' })
        @Get("/middlewiget2")
        getMiddleWidget2() {
            return this.dashboardService.dashboardMiddleWidget2();
        }

        @ApiOperation({ summary: 'Dashboard Bottomwiget' })
        @Get("/bottomwiget")
        getBottomWidget() {
            return this.dashboardService.dashboardBottomWidget();
        }
}
