import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { getRepository } from "typeorm";
import LogInDto from "../api/authentication/log-in.dto";
import UserDto from "../api/user/user.dto";
import User from "../api/user/user.entity";
import UserAlreadyExistsException from "../exceptions/user-already-exists.exception";
import WrongCredentialsException from "../exceptions/wrong-credentials.exception";
import TokenDataStored from "../interfaces/token-data-stored.interface";
import TokenData from "../interfaces/token-data.interface";

class AuthenticationService {
    private userRepository = getRepository(User);

    public async register(userData: UserDto) {
        const userAleradyExists = await this.userRepository.findOne({email: userData.email});

        if (userAleradyExists) {
            throw new UserAlreadyExistsException(userData.email);
        }

        const hashedPassowrd = await bcrypt.hash(userData.password, 10);
        const user = this.userRepository.create({...userData, password: hashedPassowrd});

        await this.userRepository.save(user);
        user.password = undefined;

        const tokenData: TokenData = this.createToken(user);
        const cookie = this.createCookie(tokenData);

        return {
            cookie,
            user,
        };
    }

    public async login(logInData: LogInDto) {
        const user = await this.userRepository.findOne({email: logInData.email});
        if (!user) {
            throw new WrongCredentialsException();
        }

        const isMatchedPassword = await bcrypt.compare(logInData.password, user.password ?? "");
        if (!isMatchedPassword) {
            throw new WrongCredentialsException();
        }

        const tokenData: TokenData = this.createToken(user);
        const cookie = this.createCookie(tokenData);
        user.password = undefined;

        return {
            cookie,
            user,
        };
    }

    public createToken(user: User): TokenData {
        const expiresIn = 60 * 60; // an hour
        const secret = process.env.JWT_SECRET ?? "";
        const tokenDataStored: TokenDataStored = {
            _id: user.id ?? "",
        };

        return {
            expiresIn,
            token: jwt.sign(tokenDataStored, secret, {expiresIn}),
        };
    }

    public createCookie(tokenData: TokenData): string {
        return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
    }
}

export default AuthenticationService;
