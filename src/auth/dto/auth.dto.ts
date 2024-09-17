import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class AuthDto {
    @IsNotEmpty()
    @ApiProperty()
    readonly user_name: string;
    
    @IsNotEmpty()
    @ApiProperty()
    readonly password: string;
}