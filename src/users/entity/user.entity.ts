import { BaseEntity, Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User extends BaseEntity{

    @PrimaryGeneratedColumn()
    id:number

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

    
    constructor(partial?: Partial<User>) {
        super();
        if (partial) {
            Object.assign(this, partial)
        }
    }
}