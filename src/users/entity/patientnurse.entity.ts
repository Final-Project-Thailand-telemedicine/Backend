import { Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class PatientNurse {

    @PrimaryColumn()
    patient_id: number;

    @PrimaryColumn()
    nurse_id: number;

    @ManyToOne(() => User, { eager: true })
    @JoinColumn({ name: "patient_id" })
    patient: User;

    @ManyToOne(() => User, { eager: true })
    @JoinColumn({ name: "nurse_id" })
    nurse: User;

    constructor(partial?: Partial<PatientNurse>) {
        if (partial) {
            Object.assign(this, partial);
        }
    }
}
