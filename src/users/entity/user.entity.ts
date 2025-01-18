import { Exclude } from "class-transformer";
import { CustomBaseEntity } from "src/common/entities/common-entitie";
import { Diagnosis } from "src/diagnosis/entity/diagnosis.entity";
import { Perusal } from "src/perusal/entity/perusal.entity";
import { Role } from "src/roles/entity/role.entity";
import { Room } from "src/rooms/entity/room.entity";
import { BaseEntity, Column, Entity, Index, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PatientNurse } from "./patientnurse.entity";

@Entity()
export class User extends CustomBaseEntity {

    @Column()
    ssid: string;

    @Column()
    sex: string;

    @Column()
    phone: string;

    @Column()
    first_name: string;

    @Column()
    last_name: string;

    @Column()
    birthdate: Date;

    @Column()
    @Exclude()
    password: string;

    @Column()
    profile_image: string;

    @Exclude()
    @Column({ name: 'refresh_token', nullable: true })
    refreshToken: string;

    @ManyToMany(() => Role, (_) => _.user)
    @JoinTable({
        name: "user_role",
        joinColumn: {
            name: "user_id",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "role_id",
            referencedColumnName: "id"
        }
    })
    role: Array<Role>;

    @ManyToMany(() => Room, (_) => _.user)
    @JoinTable({
        name: "room_user",
        joinColumn: {
            name: "user_id",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "room_id",
            referencedColumnName: "id"
        }
    })
    room: Array<Room>;

    @OneToMany(() => Room, (_) => _.user)
    rooms: Array<Room>;

    @OneToMany(() => Perusal, (_) => _.user)
    perusal: Array<Perusal>;

    @OneToMany(() => Diagnosis, (_) => _.nurse)
    diagnosis: Array<Diagnosis>;

    @OneToMany(() => PatientNurse, (patientNurse) => patientNurse.patient)
    asPatient: Array<PatientNurse>;

    @OneToMany(() => PatientNurse, (patientNurse) => patientNurse.nurse)
    asNurse: Array<PatientNurse>;
    
    constructor(partial?: Partial<User>) {
        super();
        if (partial) {
            Object.assign(this, partial)
        }
    }
}