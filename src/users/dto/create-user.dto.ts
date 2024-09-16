import { IsNotEmpty } from "class-validator";

export class CreateUserDto{
    
    user_email: string;

    ssid: number;

    sex: string;

    user_name: string;

    phone: number;

    first_name: string;

    last_name: string;

    birthdate: Date;

    password: string;

    profile_image:string;

}