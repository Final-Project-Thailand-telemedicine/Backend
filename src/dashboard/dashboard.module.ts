import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entity/user.entity';
import { Role } from 'src/roles/entity/role.entity';
import { PatientNurse } from 'src/users/entity/patientnurse.entity';
import { Perusal } from 'src/perusal/entity/perusal.entity';

@Module({
    imports: [
      JwtModule.register({}),
      TypeOrmModule.forFeature([User, Role, PatientNurse, Perusal]),
    ],
  controllers: [DashboardController],
  providers: [DashboardService]
})
export class DashboardModule {}
