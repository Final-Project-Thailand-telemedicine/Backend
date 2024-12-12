import { CustomBaseEntity } from "src/common/entities/common-entitie";
import { Perusal } from "src/perusal/entity/perusal.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";


export enum WoundArea {
    Type_1 = "หัว",
    Type_2 = "แขน",
    Type_3 = "หลัง",
    Type_4 = "ขา",
    Type_5 = "ก้น",
    Type_6 = "เท้า",
}

export enum WoundStatus {
    Pending = "รอตรวจ",
    Done = "ตรวจแล้ว",
    Canceled = "ยกเลิก"
}

export enum WoundType {
    New_Wound = "แผลใหม่",
    Old_Wound = "แผลเก่า",
}

@Entity()
export class Wound extends CustomBaseEntity{

    @ManyToOne(() => Perusal, (_) => _.wound)
    @JoinColumn({ name: 'perusal_id' })
    perusal: Perusal

    @Column()
    wound_image: string

    @Column({type:"enum", enum: WoundArea})
    area: WoundArea

    @Column({type:"enum", enum: WoundStatus})
    status: WoundStatus

    @Column({type:"enum", enum: WoundType})
    wound_type: WoundType

    @Column({ nullable: true })
    wound_ref: number

    constructor(partial?: Partial<Wound>) {
        super();
        if (partial) {
            Object.assign(this, partial)
        }
    }
}