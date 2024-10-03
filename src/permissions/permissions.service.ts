import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './entity/permission.entity';
import { Repository } from 'typeorm';
import { CreatePermission } from './dto/create-permission.dto';

@Injectable()
export class PermissionsService {

    constructor(
        @InjectRepository(Permission)
        private permissionRepository: Repository<Permission>,
    ) { }

    async create(createPermission: CreatePermission): Promise<Permission> {
        const permission = this.permissionRepository.create(createPermission);

        return await this.permissionRepository.save(permission);
    }

    async update(id: number, updatePermission: CreatePermission): Promise<Permission> {
        const permission = await this.permissionRepository.findOne({ where: { id } });
        if (!permission) {
            throw new NotFoundException('Permission not found');
        }
        return await this.permissionRepository.save({ ...permission, ...updatePermission });
    }

    async delete(id: number): Promise<Permission> {
        const permission = await this.permissionRepository.findOne({ where: { id } });
        if (!permission) {
            throw new NotFoundException('Permission not found');
        }
        return await this.permissionRepository.remove(permission);
    }

    async getPermissions(): Promise<Permission[]> {
        return await this.permissionRepository.find();
    }
}
