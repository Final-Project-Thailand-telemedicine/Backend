import { Module } from '@nestjs/common';
import { WoundService } from './wound.service';
import { WoundController } from './wound.controller';

@Module({
  providers: [WoundService],
  controllers: [WoundController]
})
export class WoundModule {}
