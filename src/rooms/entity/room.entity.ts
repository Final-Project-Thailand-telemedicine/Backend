import {
    Entity,
    Column,
    OneToMany,
    ManyToMany,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { User } from 'src/users/entity/user.entity';
import { Chat } from 'src/chats/entity/chat.entity';
import { CustomBaseEntity } from 'src/common/entities/common-entitie';
import { Perusal } from 'src/perusal/entity/perusal.entity';

@Entity('room')
export class Room extends CustomBaseEntity {
    @Column({ nullable: false })
    name: string;

    @ManyToMany(() => User, (_) => _.room)
    user: Array<User>;

    @ManyToOne(() => Perusal, (_) => _.room)
    @JoinColumn({ name: 'perusal_id' })
    perusal: Perusal;

    @OneToMany(() => Chat, (chat) => chat.room)
    chats: Chat[];

    @ManyToOne(() => User, (user) => user.rooms, { nullable: true })
    owner: User;

    constructor(partial?: Partial<Room>) {
        super();
        if (partial) {
            Object.assign(this, partial)
        }
    }
}
