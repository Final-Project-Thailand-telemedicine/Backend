import { PartialType } from "@nestjs/swagger";
import { CreateWoundStateDto } from "./create-woundstate.dto";

export class UpdateWoundStateDto extends PartialType(CreateWoundStateDto) {

}