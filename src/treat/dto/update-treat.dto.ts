import { PartialType } from "@nestjs/swagger";
import { CreateTreatDTO } from "./create-treat.dto";

export class UpdateTreatDTO extends PartialType(CreateTreatDTO){

}