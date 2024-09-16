import { CustomBaseEntity } from "src/common/entities/common-entitie";
import { Column, Entity, Index, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "src/roles/entity/role.entity";

@Entity()
export class Permission extends CustomBaseEntity{
    @Column()
    @Index({ unique: true })
    name: string;

    @ManyToMany(() => Role, (_) => _.permission)
    role: Array<Role>;
}