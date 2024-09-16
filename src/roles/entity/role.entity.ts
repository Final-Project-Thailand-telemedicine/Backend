import { CustomBaseEntity } from "src/common/entities/common-entitie";
import { Permission } from "src/permissions/entity/permission.entity";
import { User } from "src/users/entity/user.entity";
import { Column, Entity, Index, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Role extends CustomBaseEntity{
    @Column()
    @Index({ unique: true })
    name: string;

    @ManyToMany(() => User, (_) => _.role)
    user: Array<User>;

    @ManyToMany(() => Permission, (_) => _.role)
    @JoinTable({
        name: "role_permission",
        joinColumn: {
            name: "role_id",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "permission_id",
            referencedColumnName: "id"
        }
    })
    permission: Array<Permission>;
}