import { DataSource } from "typeorm";
import * as dotenv from 'dotenv';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';

const envPath = path.resolve(process.cwd(), `.env.${process.env.NODE_ENV || 'development'}`);
dotenv.config({ path: envPath });

const configService = new ConfigService();

export default new DataSource({
    type: "postgres",
    host: configService.get<string>('DATABASE_HOST') || "localhost",
    port: parseInt(configService.get<string>('DATABASE_PORT') || "5432", 10),
    username: configService.get<string>('DATABASE_USER') || "reservation_user",
    password: configService.get<string>('DATABASE_PASSWORD') || "reservation_password",
    database: configService.get<string>('DATABASE_NAME') || "reservation_db",
    entities: ["src/v1/**/*.entity.ts"],
    migrations: ["src/migrations/*.ts"],
    subscribers: [],
    synchronize: false,
})
