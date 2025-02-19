import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { Helper } from 'src/common/helper';

@Injectable()
export class AuthService {

    constructor(
        private readonly usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    async signIn(authDto: AuthDto) {

        const decrypt_password = await Helper.decryptData(authDto.password);
        const user = await this.usersService.findBySSID(authDto.ssid);
        console.log(user);

        if (!user) throw new UnauthorizedException('ssid or password is not correct');

        const passwordMatches = await argon2.verify(user.password, decrypt_password);
        if (!passwordMatches) throw new UnauthorizedException('ssid or password is not correct');

        const tokens = await this.getTokens(user.id, user.ssid, user.role[0].id);
        await this.updateRefreshToken(user.id, tokens.refreshToken);

        return {
            ...tokens,
        };
    }

    async getTokens(userId: number, ssid: string, roleId: number) {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync({ Uid: userId, ssid, roleId }, { secret: this.configService.get<string>('JWT_ACCESS_SECRET'), expiresIn: '1y' }),
            this.jwtService.signAsync({ Uid: userId, ssid, roleId }, { secret: this.configService.get<string>('JWT_REFRESH_SECRET'), expiresIn: '2y' })
        ]);

        return {
            accessToken,
            refreshToken,
        };
    }

    async updateRefreshToken(userId: number, refreshToken: string) {
        const hash = await argon2.hash(refreshToken);
        await this.usersService.updateRefreshToken(userId, hash)
    }


    async logout(userId: number, password: string) {
        const user = await this.usersService.getbyId(userId);
        if (!user) throw new NotFoundException('User not found.');

        const passwordMatches = await argon2.verify(user.password, password);
        if (!passwordMatches) throw new UnauthorizedException('username or password is not correct');

        await this.usersService.updateRefreshToken(userId, null)

        return true
    }

    async refreshTokens(userId: number, refreshToken: string) {
        const user = await this.usersService.getbyId(userId);
        if (!user || !user.refreshToken)
            throw new ForbiddenException('Access Denied');
        const refreshTokenMatches = await argon2.verify(
            user.refreshToken,
            refreshToken,
        );
        if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
        const tokens = await this.getTokens(user.id, user.ssid, user.role[0].id);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        return tokens;
    }

    async signInWithToken(accessToken: string) {
        const data = this.jwtService.decode(accessToken);

        const user = await this.usersService.findBySSID(data.ssid);
        if (!user) throw new UnauthorizedException('user not found');

        const tokens = await this.getTokens(user.id, user.ssid, user.role[0].id);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        return tokens;
    }

    async sendOTPmessage(phone: string) {
        
        const uid = await this.usersService.findUserIdbyPhone(phone); // Now correctly throws an error if user is not found
    
        const axios = require('axios');
    
        const config = {
            method: 'post',
            url: 'https://portal-otp.smsmkt.com/api/otp-send',
            headers: {
                "Content-Type": "application/json",
                "api_key": process.env.SMS_API_KEY,
                "secret_key": process.env.SMS_SECRET_KEY,
            },
            data: JSON.stringify({
                "project_key": process.env.SMS_PROJECT_KEY,
                "phone": phone,
            }),
        };
    
        try {
            const response = await axios(config);
            
            return {...response.data, uid:uid};
        } catch (error) {
            console.error("Error sending OTP:", error?.response?.data || error.message);
            throw new InternalServerErrorException("Failed to send OTP");
        }
    }
    
    
    

    async verifyOTPmessage(token: string, otp: string) {
        var axios = require('axios');
        var config = {
            method: 'post',
            url: 'https://portal-otp.smsmkt.com/api/otp-validate',
            headers: {
                "Content-Type": "application/json",
                "api_key": process.env.SMS_API_KEY,
                "secret_key": process.env.SMS_SECRET_KEY,
            },
            data:JSON.stringify({
                "token":token,
                "otp_code":otp,
            })
        };
        try {
            const response = await axios(config);
            return response.data;
        } catch (error) {
            console.error("Error sending OTP:", error);
            throw new Error("Failed to send OTP");
        }
    }
}
