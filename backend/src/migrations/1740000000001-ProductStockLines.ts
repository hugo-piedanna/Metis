import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Refonte : produit = fiche ; stock = lignes (quantity + unit + expiration?).
 * Remplace la table `lots` et retire quantity/unit du produit.
 */
export class ProductStockLines1740000000001 implements MigrationInterface {
  name = 'ProductStockLines1740000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lots" DROP CONSTRAINT "FK_lots_product"`,
    );
    await queryRunner.query(`ALTER TABLE "lots" RENAME TO "stocks"`);
    await queryRunner.query(
      `ALTER TABLE "stocks" RENAME CONSTRAINT "PK_lots" TO "PK_stocks"`,
    );

    await queryRunner.query(
      `ALTER TABLE "stocks" ALTER COLUMN "expirationDate" DROP NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "stocks" ADD "unit_id" uuid`);

    await queryRunner.query(`
      ALTER TABLE "stocks"
      ADD CONSTRAINT "FK_stocks_product"
      FOREIGN KEY ("product_id") REFERENCES "products"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "stocks"
      ADD CONSTRAINT "FK_stocks_unit"
      FOREIGN KEY ("unit_id") REFERENCES "units"("id")
      ON DELETE RESTRICT ON UPDATE NO ACTION
    `);

    await queryRunner.query(
      `ALTER TABLE "products" DROP CONSTRAINT "FK_products_unit"`,
    );
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "unit_id"`);
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "quantity"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "products" ADD "quantity" double precision NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(`ALTER TABLE "products" ADD "unit_id" uuid`);
    await queryRunner.query(`
      ALTER TABLE "products"
      ADD CONSTRAINT "FK_products_unit"
      FOREIGN KEY ("unit_id") REFERENCES "units"("id")
      ON DELETE SET NULL ON UPDATE NO ACTION
    `);

    await queryRunner.query(
      `ALTER TABLE "stocks" DROP CONSTRAINT "FK_stocks_unit"`,
    );
    await queryRunner.query(
      `ALTER TABLE "stocks" DROP CONSTRAINT "FK_stocks_product"`,
    );
    await queryRunner.query(`ALTER TABLE "stocks" DROP COLUMN "unit_id"`);
    await queryRunner.query(
      `ALTER TABLE "stocks" ALTER COLUMN "expirationDate" SET NOT NULL`,
    );

    await queryRunner.query(`ALTER TABLE "stocks" RENAME TO "lots"`);
    await queryRunner.query(
      `ALTER TABLE "lots" RENAME CONSTRAINT "PK_stocks" TO "PK_lots"`,
    );
    await queryRunner.query(`
      ALTER TABLE "lots"
      ADD CONSTRAINT "FK_lots_product"
      FOREIGN KEY ("product_id") REFERENCES "products"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION
    `);
  }
}
