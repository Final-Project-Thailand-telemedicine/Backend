import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { SeederController } from './seeder.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entity/user.entity';
import { Role } from 'src/roles/entity/role.entity';
import { Permission } from 'src/permissions/entity/permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Permission])],
  providers: [SeederService],
  controllers: [SeederController]
})
export class SeederModule {}
