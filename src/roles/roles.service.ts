import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entity/role.entity';
import { Permission } from 'src/permissions/entity/permission.entity';
import { In, Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {

    constructor(
        @InjectRepository(Role)
        private roleRepository: Repository<Role>,
        @InjectRepository(Permission)
        private permissionRepository: Repository<Permission>,
    ) { }

    async create(createRoleDto: CreateRoleDto): Promise<Role> {
        const { name, description, permissionIds } = createRoleDto;

        const role = this.roleRepository.create({
            name,
            description,
        });

        if (permissionIds && permissionIds.length > 0) {
            const permissions = await this.permissionRepository.find({
                where: { id: In(permissionIds) },
            });
            role.permission = permissions;
        }

        return await this.roleRepository.save(role);
    }

    async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
        const { name, description, permissionIds } = updateRoleDto;

        const role = await this.roleRepository.findOne({ where: { id }, relations: ['permissions'] });
        if (!role) {
            throw new NotFoundException('Role not found');
        }

        if (name) role.name = name;
        if (description) role.description = description;

        if (permissionIds !== undefined) {
            const permissions = await this.permissionRepository.find({
                where: { id: In(permissionIds) },
            });
            role.permission = permissions;
        }
        return await this.roleRepository.save(role);

    }

    async addPermissionToRole(roleId: number, permissionId: number): Promise<Role> {
        const role = await this.roleRepository.findOne({ where: { id: roleId }, relations: ['permissions'] });
        const permission = await this.permissionRepository.findOne({ where: { id: permissionId } });

        if (!role || !permission) {
            throw new NotFoundException('Role or Permission not found');
        }

        role.permission.push(permission);
        return await this.roleRepository.save(role);
    }

    async removePermissionFromRole(roleId: number, permissionId: number): Promise<Role> {
        const role = await this.roleRepository.findOne({ where: { id: roleId }, relations: ['permissions'] });

        if (!role) {
            throw new NotFoundException('Role not found');
        }

        role.permission = role.permission.filter(p => p.id !== permissionId);
        return await this.roleRepository.save(role);
    }

    async getPermissionsForRole(roleId: number): Promise<Permission[]> {
        const role = await this.roleRepository.findOne({
            where: { id: roleId },
            relations: ['permissions']
        });
        if (!role) {
            throw new NotFoundException(`Role with ID "${roleId}" not found`);
        }

        return role.permission;
    }

    async delete(id: number): Promise<Role> {
        const role = await this.roleRepository.findOne({ where: { id } });
        if (!role) {
            throw new NotFoundException('Role not found');
        }
        return await this.roleRepository.remove(role);
    }

    async getRoles(): Promise<Role[]> {
        return await this.roleRepository.find();
    }
}
