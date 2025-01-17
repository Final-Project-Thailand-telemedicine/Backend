import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto{

    @ApiProperty()
    readonly ssid: string;

    @ApiProperty()
    readonly sex: string;

    @ApiProperty()
    readonly phone: string;

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