module.exports = class Data1731651297617 {
    name = 'Data1731651297617'

    async up(db) {
        await db.query(`CREATE TABLE "user_deposit_entity" ("id" character varying NOT NULL, "user_address" text NOT NULL, "amount" numeric NOT NULL, "block" numeric NOT NULL, "timestamp" numeric NOT NULL, "intermediary_id" character varying, CONSTRAINT "PK_8725f4646f402f94f695136b789" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_9be4113244cb3d655743788a85" ON "user_deposit_entity" ("intermediary_id") `)
        await db.query(`CREATE TABLE "intermediary_account_entity" ("id" character varying NOT NULL, "treasury" text NOT NULL, CONSTRAINT "PK_dc371934f5e51123c62d18168bc" PRIMARY KEY ("id"))`)
        await db.query(`ALTER TABLE "user_deposit_entity" ADD CONSTRAINT "FK_9be4113244cb3d655743788a859" FOREIGN KEY ("intermediary_id") REFERENCES "intermediary_account_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`DROP TABLE "user_deposit_entity"`)
        await db.query(`DROP INDEX "public"."IDX_9be4113244cb3d655743788a85"`)
        await db.query(`DROP TABLE "intermediary_account_entity"`)
        await db.query(`ALTER TABLE "user_deposit_entity" DROP CONSTRAINT "FK_9be4113244cb3d655743788a859"`)
    }
}
