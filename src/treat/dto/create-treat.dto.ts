import { ApiProperty } from "@nestjs/swagger";

export class CreateTreat {
    @ApiProperty()
    readonly description: string;
}