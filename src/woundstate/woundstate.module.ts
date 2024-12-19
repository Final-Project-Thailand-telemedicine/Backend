import { Module } from '@nestjs/common';
import { WoundstateController } from './woundstate.controller';
import { WoundstateService } from './woundstate.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WoundState } from './entity/woundstate.entity';
import { Treat } from 'src/treat/entity/treat.entity';

@Module({
    imports: [
      TypeOrmModule.forFeature([WoundState,Treat]),
    ],
  controllers: [WoundstateController],
  providers: [WoundstateService],
  exports: [WoundstateService],
})
export class WoundstateModule {}
