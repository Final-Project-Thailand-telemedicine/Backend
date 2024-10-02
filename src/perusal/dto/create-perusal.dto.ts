import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreatePerusal {

    @ApiProperty()
    readonly perusal_date : Date;

    @ApiProperty()
    @IsNotEmpty()
    readonly patient_id: number;
}