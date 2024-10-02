import { Module } from '@nestjs/common';
import { PerusalController } from './perusal.controller';
import { PerusalService } from './perusal.service';

@Module({
  controllers: [PerusalController],
  providers: [PerusalService]
})
export class PerusalModule {}
