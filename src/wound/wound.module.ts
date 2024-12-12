import { Module } from '@nestjs/common';
import { WoundService } from './wound.service';
import { WoundController } from './wound.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wound } from './entity/wound.entity';
import { Perusal } from 'src/perusal/entity/perusal.entity';
import { HttpModule } from '@nestjs/axios';
import { User } from 'src/users/entity/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wound,Perusal,User]),
    HttpModule
  ],
  providers: [WoundService],
  controllers: [WoundController]
})
export class WoundModule {}
