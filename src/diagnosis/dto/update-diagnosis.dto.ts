import { PartialType } from "@nestjs/swagger";
import { CreateDiagnosisDTO } from "./create-diagnosis.dto";

export class UpdateDiagnosisDto extends PartialType(CreateDiagnosisDTO) {

}