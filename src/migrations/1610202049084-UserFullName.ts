import {MigrationInterface, QueryRunner} from "typeorm";

export class UserFullName1610202049084 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.renameColumn("user", "name", "fullName");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.renameColumn("user", "fullName", "name");
    }

}
