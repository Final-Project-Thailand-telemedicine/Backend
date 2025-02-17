import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpDto {
    @ApiProperty({ example: 'abcdef123456', description: 'Token received from OTP request' })
    token: string;

    @ApiProperty({ example: '123456', description: 'OTP code received via SMS or email' })
    otp: string;
}
