import { Exclude } from "class-transformer";
import { CustomBaseEntity } from "src/common/entities/common-entitie";
import { Perusal } from "src/perusal/entity/perusal.entity";
import { Role } from "src/roles/entity/role.entity";
import { BaseEntity, Column, Entity, Index, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User extends CustomBaseEntity{


    @Column()
    ssid: number;

    @Column()
    sex: string;

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

    @OneToMany(() => Perusal, (_) => _.user)
    perusal: Array<Perusal>;
    
    constructor(partial?: Partial<User>) {
        super();
        if (partial) {
            Object.assign(this, partial)
        }
    }
}