import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Role } from 'src/roles/entity/role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User,Role]),
  ],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}
