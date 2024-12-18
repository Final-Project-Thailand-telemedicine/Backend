import { Module } from '@nestjs/common';
import { WoundstateController } from './woundstate.controller';
import { WoundstateService } from './woundstate.service';

@Module({
  controllers: [WoundstateController],
  providers: [WoundstateService]
})
export class WoundstateModule {}
