import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermission } from './dto/create-permission.dto';

@Controller('permissions')
export class PermissionsController {
    constructor(
        private readonly permissionsService: PermissionsService
    ) {}

    @Get()
    getPermissions() {
        return this.permissionsService.getPermissions();
    }

    @Post()
    createPermission(@Body() createPermission: CreatePermission) {
        return this.permissionsService.create(createPermission);
    }

    @Patch('/:id')
    updatePermission(@Param('id') id: number, @Body() updatePermission: CreatePermission) {
        return this.permissionsService.update(id, updatePermission);
    }

    @Delete('/:id')
    deletePermission(@Param('id') id: number) {
        return this.permissionsService.delete(id);
    }
}
