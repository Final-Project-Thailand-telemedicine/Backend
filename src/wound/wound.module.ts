import { Module } from '@nestjs/common';
import { WoundService } from './wound.service';
import { WoundController } from './wound.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wound } from './entity/wound.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wound]),
  ],
  providers: [WoundService],
  controllers: [WoundController]
})
export class WoundModule {}
