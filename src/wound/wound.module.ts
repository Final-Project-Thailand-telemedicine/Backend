import { Module } from '@nestjs/common';
import { WoundService } from './wound.service';
import { WoundController } from './wound.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wound } from './entity/wound.entity';
import { Perusal } from 'src/perusal/entity/perusal.entity';
import { HttpModule } from '@nestjs/axios';
import { User } from 'src/users/entity/user.entity';
import { DiagnosisModule } from 'src/diagnosis/diagnosis.module';
import { WoundstateModule } from 'src/woundstate/woundstate.module';
import { WoundState } from 'src/woundstate/entity/woundstate.entity';
import { Diagnosis } from 'src/diagnosis/entity/diagnosis.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wound,Perusal,User,WoundState,Diagnosis]),
    HttpModule,
    DiagnosisModule,
    WoundstateModule
  ],
  providers: [WoundService],
  controllers: [WoundController]
})
export class WoundModule {}
