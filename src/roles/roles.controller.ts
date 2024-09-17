import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';

@Controller('roles')
export class RolesController {

    constructor(private readonly rolesService: RolesService) { }
    @Post()
    createRole(@Body() createRoleDto: CreateRoleDto) {
        return this.rolesService.create(createRoleDto);
    }

    @Patch('/:id')
    updateRole(@Body() updateRoleDto: CreateRoleDto, @Param('id') id: number) {
        return this.rolesService.update(id, updateRoleDto);
    }

    @Post("/add-permission")
    addPermissionToRole(@Body() { roleId, permissionId }) {
        return this.rolesService.addPermissionToRole(roleId, permissionId);
    }

    @Post("/remove-permission")
    removePermissionFromRole(@Body() { roleId, permissionId }) {
        return this.rolesService.removePermissionFromRole(roleId, permissionId);
    }

    @Get("/:id")
    getPermissionsForRole(@Param('id') id: number) {
        return this.rolesService.getPermissionsForRole(id);
    }

}
