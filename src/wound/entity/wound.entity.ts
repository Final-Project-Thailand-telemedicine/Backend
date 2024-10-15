import { CustomBaseEntity } from "src/common/entities/common-entitie";
import { Perusal } from "src/perusal/entity/perusal.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";


export enum WoundArea {
    // Head and Neck (0)
    Type_0_0 = "ศีรษะและคอ",
    Type_0_1 = "ใบหน้า",
    Type_0_2 = "หนังศีรษะ",
    Type_0_3 = "หู",
    Type_0_4 = "ตา",
    Type_0_5 = "ปาก",
    Type_0_6 = "จมูก",
    Type_0_7 = "คอ",
    
    // Upper Extremity (1)
    Type_1_0 = "แขน",
    Type_1_1 = "ไหล่",
    Type_1_2 = "ต้นแขน",
    Type_1_3 = "ข้อศอก",
    Type_1_4 = "ปลายแขน",
    Type_1_5 = "ข้อมือ",
    Type_1_6 = "มือ",
    Type_1_7 = "นิ้วมือ",
    
    // Thorax and Abdomen (2)
    Type_2_0 = "ทรวงอก",
    Type_2_1 = "หน้าอก",
    Type_2_2 = "ท้อง",
    Type_2_3 = "หลังส่วนล่าง",
    Type_2_4 = "ขาหนีบ",
    
    // Lower Extremity (3)
    Type_3_0 = "ขา",
    Type_3_1 = "สะโพก",
    Type_3_2 = "ต้นขา",
    Type_3_3 = "เข่า",
    Type_3_4 = "ปลายขา",
    Type_3_5 = "ข้อเท้า",
    Type_3_6 = "เท้า",
    Type_3_7 = "นิ้วเท้า",
    
    // Other (4)
    Type_4_0 = "อื่น ๆ"
}

export enum WoundStatus {
    Pending = "รอตรวจ",
    Done = "ตรวจแล้ว",
    Canceled = "ยกเลิก"
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

    constructor(partial?: Partial<Wound>) {
        super();
        if (partial) {
            Object.assign(this, partial)
        }
    }
}