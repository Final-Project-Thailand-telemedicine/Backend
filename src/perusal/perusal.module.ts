import { Module } from '@nestjs/common';
import { PerusalController } from './perusal.controller';
import { PerusalService } from './perusal.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Perusal } from './entity/perusal.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Perusal]),
  ],
  controllers: [PerusalController],
  providers: [PerusalService]
})
export class PerusalModule {}
