import { PartialType } from "@nestjs/swagger";
import { CreatePermission } from "./create-permission.dto";

export class UpdatePermission extends PartialType(CreatePermission){
    
}