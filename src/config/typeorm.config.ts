import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { config as dotenvConfig } from 'dotenv';

dotenvConfig();
export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: process.env.NODE_ENV === 'docker' ? 'db' : process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT,10) || 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    synchronize: true
}
