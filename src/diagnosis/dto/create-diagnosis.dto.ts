import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { WoundStateEnum } from "src/woundstate/entity/woundstate.entity";

export class CreateDiagnosisDTO {
    @ApiProperty()
    wound_id: number;

    @ApiProperty()
    nurse_id: number;

    @ApiProperty(
        {
            enum: WoundStateEnum,
            enumName: 'WoundState',
            description: 'State of the wound'
        }
    )

    @IsEnum(WoundStateEnum)
    wound_state: WoundStateEnum;

    @ApiProperty()
    remark: string;
}