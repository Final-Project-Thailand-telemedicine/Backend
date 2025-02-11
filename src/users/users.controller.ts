import { Body, Controller, Delete, Get, Param, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto'; // Ensure this DTO is created for user registration
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangeFormatToJsonPipe } from 'src/pipes/change-format-to-json/change-format-to-json.pipe';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { PERUSAL_PAGINATION_CONFIG } from 'src/perusal/perusal.service';
import { ProfileUserDto } from './dto/profile-user.dto';

@ApiTags('users (ผู้ใช้)')
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
    async register(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    @ApiOperation({ summary: 'แก้ไขข้อมูล User' })
    @Patch("/:id")
    async updateUser(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(id, updateUserDto);
    }

    @ApiOperation({ summary: 'แก้ไขข้อมูล profild' })
    @Patch("/profile/:id")
    async updateUserProfile(@Param('id') id: number, @Body() ProfileUserDto: ProfileUserDto) {
        return this.usersService.updateprofile(id, ProfileUserDto);
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

    @ApiOperation({ summary: 'Profile User' })
    @Get("/profile/:id")
    @Auth()
    getProfile(@Param('id') id: number) {
        return this.usersService.getProfile(id);
    }

    @ApiOperation({ summary: 'Profile User' })
    @Get("/profilebytoken/:accessToken")
    @Auth()
    getProfilebytoken(@Param('accessToken') accessToken: string) {
        return this.usersService.getProfilebytoken(accessToken);
    }

    @ApiOperation({ summary: 'Add Role to User' })
    @Post("/add-role/:userId/:roleId")
    addRoleToUser(@Param('userId') userId: number, @Param('roleId') roleId: number) {
        return this.usersService.addRoleToUser(userId, roleId);
    }

    @ApiOperation({ summary: 'Get User by Role' })
    @Get("/role/:roleId")
    @ApiPaginationQuery(PERUSAL_PAGINATION_CONFIG)
    getUserByRole(@Paginate() query: PaginateQuery,@Param('roleId') roleId: number) {
        return this.usersService.getPagebyRole(query, roleId);
    }

    @ApiOperation({ summary: 'All patient' })
    @Get("/patient/all")
    dropdownPatient() {
        return this.usersService.allPatients();
    }

    @ApiOperation({ summary: 'dropdown patien except in Nurse' })
    @Get("/patient/dropdown/:nurseId")
    dropdownPatientexceptNurse(@Param('nurseId') nurseId: number) {
        return this.usersService.allPatientsNotinNurse(nurseId);
    }
    @ApiOperation({ summary: 'add patient_nurse' })
    @Post("/add-patient-nurse/:patientId/:nurseId")
    addPatientNurse(@Param('patientId') patientId: number, @Param('nurseId') nurseId: number) {
        return this.usersService.addPatientToNurse(patientId, nurseId);
    }
    
    @ApiOperation({ summary: 'get patient by NurseID' })
    @Get("/patient/:nurseId")
    getPatientByNurseId(@Param('nurseId') nurseId: number) {
        return this.usersService.getPatientbyNurseID(nurseId);
    }

    @ApiOperation({ summary: 'delete patient nurse' })
    @Delete("/delete-patient-nurse/:patientId/:nurseId")
    deletePatientNurse(@Param('patientId') patientId: number, @Param('nurseId') nurseId: number) {
        return this.usersService.deletePatientNurse(patientId, nurseId);
    }
}