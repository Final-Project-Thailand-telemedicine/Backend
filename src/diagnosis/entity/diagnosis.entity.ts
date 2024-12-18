import { CustomBaseEntity } from "src/common/entities/common-entitie";
import { Treat } from "src/treat/entity/treat.entity";
import { User } from "src/users/entity/user.entity";
import { Wound } from "src/wound/entity/wound.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne } from "typeorm";

export enum WoundState {
    State_1 = 1,
    State_2 = 2,
    State_3 = 3,
    State_4 = 4
}

@Entity()
export class Diagnosis extends CustomBaseEntity {
    @ManyToOne(() => Wound, (_) => _.diagnosis)
    @JoinColumn({ name: 'wound_id' })
    wound: Wound

    @ManyToOne(() => User, (_) => _.diagnosis)
    @JoinColumn({ name: 'nurse_id' })
    nurse: User

    @Column({ type: "enum", enum: WoundState })
    wound_state: WoundState

    @Column()
    remark: string

    @ManyToMany(() => Treat, (_) => _.diagnosis)
    @JoinTable({
        name: "diagnosis_treat",
        joinColumn: {
            name: "diagnosis_id",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "treat_id",
            referencedColumnName: "id"
        }
    })
    treat: Array<Treat>;

    constructor(partial?: Partial<Diagnosis>) {
        super();
        if (partial) {
            Object.assign(this, partial)
        }
    }
}