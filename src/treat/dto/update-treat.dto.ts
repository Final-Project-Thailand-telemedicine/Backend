import { PartialType } from "@nestjs/swagger";
import { CreateTreat } from "./create-treat.dto";

export class UpdateTreat extends PartialType(CreateTreat){

}