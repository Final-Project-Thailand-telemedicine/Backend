import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UsePipes } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangeFormatToJsonPipe } from 'src/pipes/change-format-to-json/change-format-to-json.pipe';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}
    @ApiOperation({ summary: 'ดูข้อมูล User' })
    @Get("/:id")
    getUsers(@Param('id') id:number) {
        return this.usersService.getbyId(id);
    }

    @ApiOperation({ summary: 'สร้าง User' })
    @Post()
    @UsePipes(new ChangeFormatToJsonPipe())
    createUser(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    @ApiOperation({ summary: 'แก้ไขข้อมูล User' })
    @Patch("/:id")
    updateUser(@Param('id') id:number,@Body() updateUserDto:UpdateUserDto) {
        return this.usersService.update(updateUserDto);
    }

    @ApiOperation({ summary: 'ลบ User' })
    @Delete("/:id")
    deleteUser(@Param('id') id:number) {
        return this.usersService.delete(id);
    }

}
