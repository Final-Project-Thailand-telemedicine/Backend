import { CustomBaseEntity } from "src/common/entities/common-entitie";
import { Diagnosis } from "src/diagnosis/entity/diagnosis.entity";
import { Treat } from "src/treat/entity/treat.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne } from "typeorm";

export enum WoundStateEnum{
    State_1 = 1,
    State_2 = 2,
    State_3 = 3,
    State_4 = 4
}
@Entity()
export class WoundState extends CustomBaseEntity {

    @Column()
    state: number

    @Column()
    description: string

    @ManyToOne(() => Diagnosis, (_) => _.woundstate)
    @JoinColumn({ name: 'diagnosis_id' })
    diagnosis: Diagnosis

    @ManyToMany(() => Treat, (_) => _.woundstate)
    @JoinTable({
        name: "woundstate_treat",
        joinColumn: {
            name: "woundstate_id",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "treat_id",
            referencedColumnName: "id"
        }
    })
    treat: Array<Treat>;

    constructor(partial?: Partial<WoundState>) {
        super();
        if (partial) {
            Object.assign(this, partial)
        }
    }
}
