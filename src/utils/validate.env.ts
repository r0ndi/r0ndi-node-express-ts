import {
    cleanEnv, str, port,
} from "envalid";

function validateEnv() {
    cleanEnv(process.env, {
        POSTGRES_HOST: str(),
        POSTGRES_PORT: str(),
        POSTGRES_USER: str(),
        POSTGRES_PASSWORD: str(),
        POSTGRES_DATABASE: str(),
        JWT_SECRET: str(),
        PORT: port(),
    });
}

export default validateEnv;
