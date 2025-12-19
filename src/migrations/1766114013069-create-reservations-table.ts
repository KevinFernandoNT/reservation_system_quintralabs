import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateReservationsTable1766114013069 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "reservations" IF NOT EXISTS(
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "resourceId" character varying NOT NULL,
                "userId" character varying NOT NULL,
                "startTime" TIMESTAMP WITH TIME ZONE NOT NULL,
                "endTime" TIMESTAMP WITH TIME ZONE NOT NULL,
                "timezone" character varying NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_reservations_id" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`CREATE INDEX "IDX_reservations_resourceId" ON "reservations" ("resourceId")`);
        await queryRunner.query(`CREATE INDEX "IDX_reservations_userId" ON "reservations" ("userId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_reservations_userId"`);
        await queryRunner.query(`DROP INDEX "IDX_reservations_resourceId"`);
        await queryRunner.query(`DROP TABLE "reservations"`);
    }

}
