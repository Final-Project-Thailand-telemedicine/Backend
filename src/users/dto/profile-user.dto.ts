import { ApiProperty } from "@nestjs/swagger";

export class ProfileUserDto{

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
    readonly profile_image:string;
    
}