import { Module } from '@nestjs/common';
import { TreatController } from './treat.controller';
import { TreatService } from './treat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Treat } from './entity/treat.entity';

@Module({
    imports: [
      TypeOrmModule.forFeature([Treat]),
    ],
  controllers: [TreatController],
  providers: [TreatService]
})
export class TreatModule {}
