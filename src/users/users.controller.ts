import { Body, Controller, Delete, Get, Param, Patch, Post, UsePipes } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user-dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}
    @Get("/:id")
    getUsers(@Param('id') id:number) {
        return this.usersService.getbyId(id);
    }

    @Post("create_user")
    createUser(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    @Patch("/:id")
    updateUser(@Param('id') id:number) {
        return this.usersService.update(id);
    }

    @Delete("/:id")
    deleteUser(@Param('id') id:number) {
        return this.usersService.delete(id);
    }

}
