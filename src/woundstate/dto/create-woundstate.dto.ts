import { ApiProperty } from "@nestjs/swagger";
import { WoundStateEnum } from "../entity/woundstate.entity";
import { IsEnum } from "class-validator";

export class CreateWoundStateDto {
    @ApiProperty(
        {
            enum: WoundStateEnum,
            enumName: 'WoundState',
            description: 'State of the wound'
        }
    )

    @IsEnum(WoundStateEnum)
    state: WoundStateEnum;

    @ApiProperty()
    description: string
}