import { CustomBaseEntity } from "src/common/entities/common-entitie";
import { Role } from "src/roles/entity/role.entity";
import { BaseEntity, Column, Entity, Index, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User extends CustomBaseEntity{

    @Column()
    user_email: string;

    @Column()
    ssid: number;

    @Column()
    sex: string;

    @Column()
    @Index({ unique: true })
    user_name: string;

    @Column()
    phone: number;

    @Column()
    first_name: string;

    @Column()
    last_name: string;

    @Column()
    birthdate: Date;

    @Column()
    password: string;

    @Column()
    profile_image:string;

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
    constructor(partial?: Partial<User>) {
        super();
        if (partial) {
            Object.assign(this, partial)
        }
    }
}