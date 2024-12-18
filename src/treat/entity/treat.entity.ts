import { CustomBaseEntity } from "src/common/entities/common-entitie";
import { Diagnosis } from "src/diagnosis/entity/diagnosis.entity";
import { Column, Entity, ManyToMany } from "typeorm";

@Entity()
export class Treat extends CustomBaseEntity {
    @Column()
    description: string

    @ManyToMany(() => Diagnosis, (_) => _.treat)
    diagnosis: Array<Diagnosis>;
    
    constructor(partial?: Partial<Treat>) {
        super();
        if (partial) {
            Object.assign(this, partial)
        }
    }
}