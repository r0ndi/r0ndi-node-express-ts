import Controller from "../../interfaces/controller.interface";
import * as express from "express";
import validationMiddlaware from "../../middlewares/validation.middleware";
import LogInDto from "./log-in.dto";
import UserDto from "../user/user.dto";
import AuthenticationService from "../../services/authentication.service";

class AuthenticationController implements Controller {
    public path = "/auth";
    public router = express.Router();
    private authenticationService = new AuthenticationService();

    constructor() {
        this.initializeRoutes();
    }

    public logginIn = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const logInData: LogInDto = request.body;
            const {cookie, user} = await this.authenticationService.login(logInData);

            response.setHeader("Set-Cookie", [cookie]);
            response.send(user);
        } catch (error) {
            next(error);
        }
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/logout`, this.logginOut);
        this.router.post(`${this.path}/login`, validationMiddlaware(LogInDto), this.logginIn);
        this.router.post(`${this.path}/register`, validationMiddlaware(UserDto), this.registration);
    }

    private registration = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const userData: UserDto = request.body;
            const {cookie, user} = await this.authenticationService.register(userData);

            response.setHeader("Set-Cookie", [cookie]);
            response.send(user);
        } catch (error) {
            next(error);
        }
    }

    private logginOut = (request: express.Request, response: express.Response) => {
        response.setHeader("Set-Cookie", ["Authorization=;Max-age=0"]);
        response.send(200);
    }
}

export default AuthenticationController;
