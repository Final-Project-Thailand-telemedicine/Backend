import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { SeederController } from './seeder.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entity/user.entity';
import { Role } from 'src/roles/entity/role.entity';
import { Permission } from 'src/permissions/entity/permission.entity';
import { Treat } from 'src/treat/entity/treat.entity';
import { WoundState } from 'src/woundstate/entity/woundstate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Permission,Treat,WoundState])],
  providers: [SeederService],
  controllers: [SeederController]
})
export class SeederModule {}
