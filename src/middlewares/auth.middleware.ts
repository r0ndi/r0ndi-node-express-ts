import { NextFunction, Response } from "express";
import * as jwt from "jsonwebtoken";
import { getRepository } from "typeorm";
import User from "../api/user/user.entity";
import MissingAuthenticationTokenException from "../exceptions/missing-authentication-token.exception";
import WrongAuthenticationTokenException from "../exceptions/wrong-authentication-token.exception";
import RequestWithUser from "../interfaces/request-with-user.interface";
import TokenDataStored from "../interfaces/token-data-stored.interface";

async function authMiddleware(request: RequestWithUser, response: Response, next: NextFunction) {
    const userRepository = getRepository(User);
    const cookies = request.cookies;

    if (cookies && cookies.Authorization) {
        try {
            const secret: string = process.env.JWT_SECRET ?? "";
            const verificationResponse = jwt.verify(cookies.Authorization, secret) as TokenDataStored;

            const id = verificationResponse._id;
            const user = await userRepository.findOne(id);

            if (user) {
                request.user = user;
                next();
            } else {
                next(new WrongAuthenticationTokenException());
            }
        } catch (error) {
            next(new WrongAuthenticationTokenException());
        }
    } else {
        next(new MissingAuthenticationTokenException());
    }
}

export default authMiddleware;
