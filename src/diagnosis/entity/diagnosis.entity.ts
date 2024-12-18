import { CustomBaseEntity } from "src/common/entities/common-entitie";
import { Treat } from "src/treat/entity/treat.entity";
import { User } from "src/users/entity/user.entity";
import { Wound } from "src/wound/entity/wound.entity";
import { WoundState } from "src/woundstate/entity/woundstate.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany } from "typeorm";


@Entity()
export class Diagnosis extends CustomBaseEntity {
    @ManyToOne(() => Wound, (_) => _.diagnosis)
    @JoinColumn({ name: 'wound_id' })
    wound: Wound

    @ManyToOne(() => User, (_) => _.diagnosis)
    @JoinColumn({ name: 'nurse_id' })
    nurse: User

    @OneToMany(() => WoundState, (_) => _.diagnosis)
    woundstate: Array<WoundState>;

    @Column({ nullable: true })
    remark: string

    constructor(partial?: Partial<Diagnosis>) {
        super();
        if (partial) {
            Object.assign(this, partial)
        }
    }
}

export { WoundState };
