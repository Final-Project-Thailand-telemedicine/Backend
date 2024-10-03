import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class AuthDto {
    @IsNotEmpty()
    @ApiProperty()
    readonly ssid: number;
    
    @IsNotEmpty()
    @ApiProperty()
    readonly password: string;
}