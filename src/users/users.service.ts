import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {

    constructor() { }

    getbyId(id: number) {
        return `get by id: ${id}`;
    }

    create(data: any) {
        const { name, email, password } = data;
        return `name: ${name}, email: ${email}, password: ${password}`;
    }

    update(data: any) {
        return `this is update id: ${data.name}`;
    }

    delete(id: number) {
        return `this is delete id: ${id}`;
    }

}
