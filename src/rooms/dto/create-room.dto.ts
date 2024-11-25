import { ApiProperty } from "@nestjs/swagger";

export class CreateRoomDto {
    @ApiProperty()
    readonly name: string;

    @ApiProperty()
    readonly perusalId: number;

    @ApiProperty()
    readonly ownerId: number;
}