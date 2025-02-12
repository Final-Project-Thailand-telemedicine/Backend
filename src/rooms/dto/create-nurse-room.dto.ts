import { ApiProperty } from "@nestjs/swagger";

export class CreateNurseRoomDto {
    @ApiProperty()
    readonly name: string;

    @ApiProperty()
    readonly perusalId: number;

    @ApiProperty()
    readonly patientId: number;

    @ApiProperty()
    readonly ownerId: number;
}