import { ApiProperty } from "@nestjs/swagger";

export class CreatePermission {
    @ApiProperty()
    name: string;
    @ApiProperty()
    description: string;
}