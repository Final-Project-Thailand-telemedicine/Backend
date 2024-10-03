import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateRoleDto } from './dto/update-role.dto';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {

    constructor(private readonly rolesService: RolesService) { }
    @ApiOperation({ summary: 'สร้าง Role' })
    @Post()
    createRole(@Body() createRoleDto: CreateRoleDto) {
        return this.rolesService.create(createRoleDto);
    }

    @ApiOperation({ summary: 'อัพเดท Role' })
    @Patch('/:id')
    updateRole(@Body() updateRoleDto: UpdateRoleDto, @Param('id') id: number) {
        return this.rolesService.update(id, updateRoleDto);
    }

    @ApiOperation({ summary: 'เพิ่ม Permission ใน Role' })
    @Post("/add-permission")
    addPermissionToRole(@Body() { roleId, permissionId }) {
        return this.rolesService.addPermissionToRole(roleId, permissionId);
    }

    @ApiOperation({ summary: 'ลบ Permission ใน Role' })
    @Post("/remove-permission")
    removePermissionFromRole(@Body() { roleId, permissionId }) {
        return this.rolesService.removePermissionFromRole(roleId, permissionId);
    }

    @ApiOperation({ summary: 'ดึง Permission ใน Role' })
    @Get("/:id")
    getPermissionsForRole(@Param('id') id: number) {
        return this.rolesService.getPermissionsForRole(id);
    }

    @ApiOperation({ summary: 'ลบ Role' })
    @Delete("/:id")
    deleteRole(@Param('id') id: number) {
        return this.rolesService.delete(id);
    }

    @ApiOperation({ summary: 'ดูข้อมูล Role ทั้งหมด' })
    @Get()
    getAllRoles() {
        return this.rolesService.getRoles();
    }
}
