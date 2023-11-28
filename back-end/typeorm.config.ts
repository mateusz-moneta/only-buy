import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { CreateRoles1701095733886, CreateUser1701097096009 } from "./migrations";
import { RoleEntity, UserEntity } from "./src/users/entities";

config();

const configService = new ConfigService();

export default new DataSource({
    type: 'postgres',
    host: configService.get('POSTGRES_HOST'),
    port: configService.get('POSTGRES_PORT'),
    username: configService.get('POSTGRES_USER'),
    password: configService.get('POSTGRES_PASSWORD'),
    database: configService.get('POSTGRES_DB'),
    entities: [RoleEntity, UserEntity],
    migrations: [CreateRoles1701095733886, CreateUser1701097096009]
});