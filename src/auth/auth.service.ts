import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {

    constructor(
        private readonly usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    async signIn(authDto: AuthDto) {
        console.log(authDto);

        const user = await this.usersService.findByUsername(authDto.user_name);
        if (!user) throw new UnauthorizedException('username or password is not correct');

        const passwordMatches = await argon2.verify(user.password, authDto.password);
        if (!passwordMatches) throw new UnauthorizedException('username or password is not correct');

        const tokens = await this.getTokens(user.id, user.user_name, user.role[0].name);
        await this.updateRefreshToken(user.id, tokens.refreshToken);

        return {
            ...tokens,
        };
    }

    async getTokens(userId: number, username: string, role: string) {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync({ Uid: userId, username, role: role }, { secret: this.configService.get<string>('JWT_ACCESS_SECRET'), expiresIn: '1y' }),
            this.jwtService.signAsync({ Uid: userId, username, role: role }, { secret: this.configService.get<string>('JWT_REFRESH_SECRET'), expiresIn: '2y' })
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
        const tokens = await this.getTokens(user.id, user.user_name, user.role[0].name);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        return tokens;
    }

    async signInWithToken(accessToken: string) {
        const data = this.jwtService.decode(accessToken);

        const user = await this.usersService.findByUsername(data.username);
        if (!user) throw new UnauthorizedException('user not found');

        const tokens = await this.getTokens(user.id, user.user_name, user.role[0].name);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        return tokens;
    }
}
