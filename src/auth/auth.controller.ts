import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }

    @ApiOperation({ summary: 'Login เข้าสู่ระบบ' })
    @Post('/login')
    signIn(@Body() authDto: AuthDto) {
        return this.authService.signIn(authDto);
    }
}
