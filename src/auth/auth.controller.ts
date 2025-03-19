import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth } from './decorators/auth.decorator';
import { Request } from 'express';
import { RefreshTokenGuard } from 'src/common/guards/refresh-token.guard';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@ApiTags('Auth (การยืนยันตัวตน)')
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

    @ApiOperation({ summary: 'ส่ง otp' })
    @Get('send-otp/:phone')
    sendOTP(@Param('phone') phone: string) {
        return this.authService.sendOTPmessage(phone);
    }

    @ApiOperation({ summary: 'ยืนยัน otp' })
    @Post('verify-otp')
    verifyOTP(@Body() body: VerifyOtpDto) {
        return this.authService.verifyOTPmessage(body.token, body.otp);
    }
}
