import { PartialType } from "@nestjs/mapped-types";
import { CreatePermission } from "./create-permission.dto";

export class UpdatePermission extends PartialType(CreatePermission){
    
}