import "dotenv/config";
import App from "./app";
import AuthenticationController from "./api/authentication/authentication.controller";
import PostController from "./api/post/post.controller";
import validateEnv from "./utils/validate.env";
import { createConnection } from "typeorm";
import config from "./configs/orm.config";
import AddressController from "./api/address/address.controller";
import CategoryController from "./api/category/category.controller";

validateEnv();

(async () => {
    try {
        const connection = await createConnection(config);
        await connection.runMigrations();
    } catch (error) {
        console.log("Error while connecting to the database", error);
        return error;
    }

    const app = new App([
        new AuthenticationController(),
        new CategoryController(),
        new AddressController(),
        new PostController(),
    ]);

    app.listen();
})();
