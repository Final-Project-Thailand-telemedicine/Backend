import { CustomBaseEntity } from "src/common/entities/common-entitie";
import { User } from "src/users/entity/user.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity()
export class Perusal extends CustomBaseEntity {

    @Column()
    perusal_date : Date;

    @ManyToOne(() => User, (_) => _.perusal)
    @JoinColumn({ name: 'patient_id' })
    user: User;

    constructor(partial?: Partial<Perusal>) {
        super();
        if (partial) {
            Object.assign(this, partial)
        }
    }
}
