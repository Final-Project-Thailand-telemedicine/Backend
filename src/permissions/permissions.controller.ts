import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermission } from './dto/create-permission.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Permissions (สิทธิ)')
@Controller('permissions')
export class PermissionsController {
    constructor(
        private readonly permissionsService: PermissionsService
    ) {}
    @ApiOperation({ summary: 'ดูข้อมูล Permission ทั้งหมด' })
    @Get()
    getPermissions() {
        return this.permissionsService.getPermissions();
    }

    @ApiOperation({ summary: 'สร้าง Permission' })
    @Post()
    createPermission(@Body() createPermission: CreatePermission) {
        return this.permissionsService.create(createPermission);
    }

    @ApiOperation({ summary: 'แก้ไขข้อมูล Permission' })
    @Patch('/:id')
    updatePermission(@Param('id') id: number, @Body() updatePermission: CreatePermission) {
        return this.permissionsService.update(id, updatePermission);
    }

    @ApiOperation({ summary: 'ลบข้อมูล Permission' })
    @Delete('/:id')
    deletePermission(@Param('id') id: number) {
        return this.permissionsService.delete(id);
    }
}
