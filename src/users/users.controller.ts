import { Body, Controller, Delete, Get, Param, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto'; // Ensure this DTO is created for user registration
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangeFormatToJsonPipe } from 'src/pipes/change-format-to-json/change-format-to-json.pipe';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @ApiOperation({ summary: 'ดูข้อมูล User' })
    @Get("/:id")
    getUsers(@Param('id') id: number) {
        return this.usersService.getbyId(id);
    }

    @ApiOperation({ summary: 'สร้าง User' })
    @Post('register')
    @UsePipes(new ValidationPipe())
    async register(@Body() createUserDto: CreateUserDto) {
        console.log('Received registration data:', createUserDto);
        return this.usersService.create(createUserDto);
    }

    @ApiOperation({ summary: 'แก้ไขข้อมูล User' }) // "Update User Information"
    @Patch("/:id")
    async updateUser(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(id, updateUserDto);
    }

    @ApiOperation({ summary: 'ลบ User' })
    @Delete("/:id")
    deleteUser(@Param('id') id: number) {
        return this.usersService.delete(id);
    }

    @ApiOperation({ summary: 'check SSID' })
    @Get("/ssid/:ssid")
    checkssid(@Param('ssid') ssid: string) {
        return this.usersService.checkssid(ssid);
    }
}