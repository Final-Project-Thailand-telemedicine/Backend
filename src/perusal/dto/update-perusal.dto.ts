import { PartialType } from "@nestjs/mapped-types";
import { CreatePerusal } from "./create-perusal.dto";

export class UpdatePerusal extends PartialType(CreatePerusal){
    
}