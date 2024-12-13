import { CustomBaseEntity } from "src/common/entities/common-entitie";
import { Column, Entity } from "typeorm";

@Entity()
export class Treat extends CustomBaseEntity {
    @Column()
    description: string

    constructor(partial?: Partial<Treat>) {
        super();
        if (partial) {
            Object.assign(this, partial)
        }
    }
}