import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUser1701097096009 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "users" (
                                     "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
                                     "username" VARCHAR NOT NULL,
                                     "email" VARCHAR NOT NULL,
                                     "password" VARCHAR NOT NULL,
                                     "createdDate" TIMESTAMP NOT NULL DEFAULT now(),
                                     "updatedDate" TIMESTAMP NOT NULL DEFAULT now(),
                                     "roleId" INTEGER NOT NULL,
                                     "active" BOOLEAN NOT NULL DEFAULT true,
                                     "avatar" VARCHAR,
                                     CONSTRAINT "PK_users" PRIMARY KEY ("id"),
                                     CONSTRAINT "UQ_users_username" UNIQUE ("username"),
                                     CONSTRAINT "UQ_users_email" UNIQUE ("email")
            )
        `);
    await queryRunner.query(`
      INSERT INTO users (
        "id",
        "username",
        "email",
        "password",
        "createdDate",
        "updatedDate",
        "roleId",
        "active",
        "avatar"
      )
      VALUES (
        '9a111626-d24b-467c-b2c9-a2fcabf07ddf',
        'admin',
        'admin@only-buy.pl',
        '$2b$10$2vYjOMpml4gJ9hgf7pj5OuzNOQMOJkaIfXzjcIvV/p9406PZpsaJm',
        '2024-02-14 19:13:50.909089',
        '2024-02-14 19:13:50.909089',
        2,
              true,
        NULL
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM users
      WHERE id = '9a111626-d24b-467c-b2c9-a2fcabf07ddf'
    `);
  }
}
