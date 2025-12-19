import { MigrationInterface, QueryRunner } from "typeorm";

export class AddReservationStatus1766117973895 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "reservations_status_enum" AS ENUM('PENDING', 'COMPLETE', 'CANCELLED')`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD "status" "reservations_status_enum" NOT NULL DEFAULT 'PENDING'`);
        await queryRunner.query(`CREATE INDEX "IDX_reservations_status" ON "reservations" ("status")`);

        // Upgrade exclusion constraint to be partial (only for PENDING)
        await queryRunner.query(`ALTER TABLE "reservations" DROP CONSTRAINT IF EXISTS "no_overlapping_reservations"`);
        await queryRunner.query(`
            ALTER TABLE reservations
            ADD CONSTRAINT no_overlapping_reservations
            EXCLUDE USING GIST (
                "resourceId" WITH =,
                tstzrange("startTime", "endTime") WITH &&
            ) WHERE (status = 'PENDING');
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revert to non-partial constraint
        await queryRunner.query(`ALTER TABLE "reservations" DROP CONSTRAINT IF EXISTS "no_overlapping_reservations"`);
        await queryRunner.query(`
            ALTER TABLE reservations
            ADD CONSTRAINT no_overlapping_reservations
            EXCLUDE USING GIST (
                "resourceId" WITH =,
                tstzrange("startTime", "endTime") WITH &&
            );
        `);

        await queryRunner.query(`DROP INDEX "IDX_reservations_status"`);
        await queryRunner.query(`ALTER TABLE "reservations" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "reservations_status_enum"`);
    }

}
