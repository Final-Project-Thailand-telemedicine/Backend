import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto{
    @ApiProperty()
    user_email: string;
    @ApiProperty()
    ssid: number;
    @ApiProperty()
    sex: string;
    @ApiProperty()
    user_name: string;
    @ApiProperty()
    phone: number;
    @ApiProperty()
    first_name: string;
    @ApiProperty()
    last_name: string;
    @ApiProperty()
    birthdate: Date;
    @ApiProperty()
    password: string;
    @ApiProperty()
    profile_image:string;
    @ApiProperty()
    roleId:number;

}