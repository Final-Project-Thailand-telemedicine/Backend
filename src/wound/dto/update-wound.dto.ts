import { PartialType } from "@nestjs/swagger";
import { CreateWound } from "./create-wound.dto";

export class UpdateWound extends PartialType(CreateWound) {

}