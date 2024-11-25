import { ApiProperty } from "@nestjs/swagger";

export class CreateChatDto {
    @ApiProperty()
    readonly message: string;

    @ApiProperty()
    readonly senderId: number;

    @ApiProperty()
    readonly roomId: number;
}