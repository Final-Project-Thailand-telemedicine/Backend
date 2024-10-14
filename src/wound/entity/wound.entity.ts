import { CustomBaseEntity } from "src/common/entities/common-entitie";
import { Perusal } from "src/perusal/entity/perusal.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";


@Entity()
export class Wound extends CustomBaseEntity{

    @ManyToOne(() => Perusal, (_) => _.wound)
    @JoinColumn({ name: 'perusal_id' })
    perusal: Perusal

    @Column()
    wound_image: string

    @Column()
    area: string

    constructor(partial?: Partial<Wound>) {
        super();
        if (partial) {
            Object.assign(this, partial)
        }
    }
}