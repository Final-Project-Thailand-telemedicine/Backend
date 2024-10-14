import { CustomBaseEntity } from "src/common/entities/common-entitie";
import { User } from "src/users/entity/user.entity";
import { Wound } from "src/wound/entity/wound.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";

@Entity()
export class Perusal extends CustomBaseEntity {

    @Column()
    perusal_date : Date;

    @ManyToOne(() => User, (_) => _.perusal)
    @JoinColumn({ name: 'patient_id' })
    user: User;

    @OneToMany(() => Wound, (_) => _.perusal)
    wound: Array<Wound>;

    constructor(partial?: Partial<Perusal>) {
        super();
        if (partial) {
            Object.assign(this, partial)
        }
    }
}
