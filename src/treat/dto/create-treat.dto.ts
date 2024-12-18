import { ApiProperty } from "@nestjs/swagger";

export class CreateTreatDTO {
    @ApiProperty()
    readonly description: string;
}