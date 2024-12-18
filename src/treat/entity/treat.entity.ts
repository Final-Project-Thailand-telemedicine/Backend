import { CustomBaseEntity } from "src/common/entities/common-entitie";
import { Diagnosis } from "src/diagnosis/entity/diagnosis.entity";
import { WoundState } from "src/woundstate/entity/woundstate.entity";
import { Column, Entity, ManyToMany } from "typeorm";

@Entity()
export class Treat extends CustomBaseEntity {
    @Column()
    description: string

    @ManyToMany(() => WoundState, (_) => _.treat)
    woundstate: Array<WoundState>;

    constructor(partial?: Partial<Treat>) {
        super();
        if (partial) {
            Object.assign(this, partial)
        }
    }
}