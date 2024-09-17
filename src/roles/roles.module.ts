import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { Role } from './entity/role.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from 'src/permissions/entity/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role,Permission]),
  ],
  controllers: [RolesController],
  providers: [RolesService]
})
export class RolesModule {}
