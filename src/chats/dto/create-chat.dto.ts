import { ApiProperty } from "@nestjs/swagger";

export class CreateChatDto {
    @ApiProperty()
    roomId: number;

    @ApiProperty()
    senderId: number;

    @ApiProperty()
    messageType: string;

    @ApiProperty()
    message?: string;

    @ApiProperty()
    imageUrl?: string;
}