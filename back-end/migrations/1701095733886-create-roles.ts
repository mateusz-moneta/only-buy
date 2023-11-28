import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateRoles1701095733886 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`INSERT INTO roles (name) VALUES ('STANDARD')`);
        await queryRunner.query(`INSERT INTO roles (name) VALUES ('ADMIN')`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "roles"`);
    }
}
