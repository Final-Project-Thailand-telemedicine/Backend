import { ApiProperty } from "@nestjs/swagger";

export class CreatePermission {
    @ApiProperty()
    readonly name: string;
    
    @ApiProperty()
    readonly description: string;
}