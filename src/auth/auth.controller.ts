import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth } from './decorators/auth.decorator';
import { Request } from 'express';
import { RefreshTokenGuard } from 'src/common/guards/refresh-token.guard';

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


    // @Auth()
    // @Post('logout')
    // logout(@Req() req: Request, @Body() body: LogoutDto) {
    //     return this.authService.logout(req.user['sub'], body.password);
    // }

    @UseGuards(RefreshTokenGuard)
    @Post('refresh')
    refreshTokens(@Req() req: Request) {
        const userId = req.user['sub'];
        const refreshToken = req.user['refreshToken'];
        return this.authService.refreshTokens(userId, refreshToken);
    }

    @Post('sign-in-with-token')
    signInWithToken(@Body() body: { accessToken: string }) {
        return this.authService.signInWithToken(body.accessToken);
    }
}
