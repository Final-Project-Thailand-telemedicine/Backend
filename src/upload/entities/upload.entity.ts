import { AfterInsert, AfterLoad, Column, Entity } from "typeorm";
import { CustomBaseEntity } from "src/common/entities/common-entitie";
import { Exclude, Expose } from "class-transformer";

@Entity()
export class Upload extends CustomBaseEntity {

    @Column()
    fieldname: string;

    @Column()
    originalname: string;

    @Column()
    encoding: string;

    @Column()
    mimetype: string;

    @Column()
    destination: string;

    @Column()
    filename: string;

    @Column()
    path: string;

    @Column()
    size: number

    @Column({ default: 'local' })
    provider: string;

    @Column({ nullable: true })
    sha256Checksum: string;

    get pathUrl(): string {
        return this.provider == 'local' ? process.env.APP_URL + '/' + this.path : this.path;
    }

    constructor(partial?: Partial<Upload>) {
        super();
        if (partial) {
            Object.assign(this, partial)
        }
    }
}
