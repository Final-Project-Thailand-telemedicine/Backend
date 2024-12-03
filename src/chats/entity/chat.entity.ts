import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Room } from 'src/rooms/entity/room.entity';
import { User } from 'src/users/entity/user.entity';
import { CustomBaseEntity } from 'src/common/entities/common-entitie';


export enum MessageType {
    Text = "text",
    Image = "image",
}
@Entity('chat')
export class Chat extends CustomBaseEntity {

    @ManyToOne(() => Room, (room) => room.chats, { nullable: false })
    room: Room;

    @ManyToOne(() => User, { nullable: false })
    sender: User;

    @Column({ nullable: true })
    message: string;

    @Column({type:"enum", enum: MessageType})
    messageType: string;

    @Column({ nullable: true })
    imageUrl: string;

    constructor(partial?: Partial<Chat>) {
        super();
        if (partial) {
            Object.assign(this, partial)
        }
    }
}
