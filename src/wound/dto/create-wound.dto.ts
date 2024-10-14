import { ApiProperty } from "@nestjs/swagger";
import { WoundArea, WoundStatus } from "../entity/wound.entity";
import { IsEnum } from "class-validator";

export class CreateWound {
    @ApiProperty()
    perusal_id: number;

    @ApiProperty()
    wound_image: string;

    @ApiProperty(
        {
            enum: WoundArea,
            enumName: 'WoundArea',
            description: 'Area of the wound'
        }
    )

    @IsEnum(WoundArea)
    area: WoundArea;

    @ApiProperty(
        {
            enum: WoundStatus,
            enumName: 'WoundStatus',
            description: 'Status of the wound'
        }
    )

    @IsEnum(WoundStatus)
    status: WoundStatus;
}