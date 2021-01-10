import { plainToClass } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import * as express from "express";
import HttpException from "../exceptions/http.exception";

function validationMiddlaware<T>(type: any, skipMissingProperties: boolean = false): express.RequestHandler {
    return (request, response, next) => {
        validate(plainToClass(type, request.body)).then((errors: ValidationError[]) => {
            if (errors.length > 0) {
                const message = errors.map((error: ValidationError) => {
                    return Object.values(error.constraints ?? []);
                }).map(errorsArr => errorsArr.join(", ")).join();

                next(new HttpException(400, message));
            } else {
                next();
            }
        });
    };
}

export default validationMiddlaware;
