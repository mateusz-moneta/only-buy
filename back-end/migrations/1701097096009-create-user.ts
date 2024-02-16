import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateUser1701097096009 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`INSERT INTO users ("id", "username", "email", "password", "createdDate", "updatedDate", "roleId", "avatar") VALUES ("9a111626-d24b-467c-b2c9-a2fcabf07ddf", "admin", "admin@only-buy.pl", "$2b$10$2vYjOMpml4gJ9hgf7pj5OuzNOQMOJkaIfXzjcIvV/p9406PZpsaJm", "2024-02-14 19:13:50.909089", "2024-02-14 19:13:50.909089", 2, NULL)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
    }
}
