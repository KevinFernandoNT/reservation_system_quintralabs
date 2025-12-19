import { MigrationInterface, QueryRunner } from "typeorm";

export class AddExclusionConstraints1766113835369 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE EXTENSION IF NOT EXISTS btree_gist;
    `);

    await queryRunner.query(`
      ALTER TABLE reservations
      ADD CONSTRAINT no_overlapping_reservations
      EXCLUDE USING GIST (
        "resourceId" WITH =,
        tstzrange("startTime", "endTime") WITH &&
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE reservations
      DROP CONSTRAINT IF EXISTS no_overlapping_reservations;
    `);
  }

}
