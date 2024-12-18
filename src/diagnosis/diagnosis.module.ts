import { Module } from '@nestjs/common';
import { DiagnosisService } from './diagnosis.service';
import { DiagnosisController } from './diagnosis.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Diagnosis } from './entity/diagnosis.entity';
import { User } from 'src/users/entity/user.entity';
import { Wound } from 'src/wound/entity/wound.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Diagnosis,User,Wound]),
  ],
  providers: [DiagnosisService],
  controllers: [DiagnosisController],
  exports: [DiagnosisService]
})
export class DiagnosisModule { }
