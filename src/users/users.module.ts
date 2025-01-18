import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Role } from 'src/roles/entity/role.entity';
import { PatientNurse } from './entity/patientnurse.entity';
import { Perusal } from 'src/perusal/entity/perusal.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, PatientNurse, Perusal]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule { }
