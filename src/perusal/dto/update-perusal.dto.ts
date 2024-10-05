import { PartialType } from "@nestjs/swagger";
import { CreatePerusal } from "./create-perusal.dto";

export class UpdatePerusal extends PartialType(CreatePerusal){
    
}