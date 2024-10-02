import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto{
    @ApiProperty()
    readonly user_email: string;

    @ApiProperty()
    readonly ssid: number;

    @ApiProperty()
    readonly sex: string;

    @ApiProperty()
    readonly user_name: string;

    @ApiProperty()
    readonly phone: number;

    @ApiProperty()
    readonly first_name: string;

    @ApiProperty()
    readonly last_name: string;

    @ApiProperty()
    readonly birthdate: Date;

    @ApiProperty()
    readonly password: string;

    @ApiProperty()
    readonly profile_image:string;
    
    @ApiProperty()
    readonly roleId:number;

}