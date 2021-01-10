import * as express from "express";
import * as bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import Controller from "./interfaces/controller.interface";
import loggerMiddleware from "./middlewares/logger.middleware";
import errorMiddleware from "./middlewares/error.middleware";

class App {
    public app: express.Application;

    constructor(controllers: Controller[]) {
        this.app = express.default();

        this.initializeMiddlewares();
        this.initializeControllers(controllers);
        this.initializeErrorHandling();
    }

    public getServer(): express.Application {
        return this.app;
    }

    public listen(): void {
        this.app.listen(process.env.PORT, () => {
            console.log(`App listening on the port ${process.env.PORT}`);
        });
    }

    private initializeMiddlewares(): void {
        this.app.use(loggerMiddleware);
        this.app.use(bodyParser.json());
        this.app.use(cookieParser());
    }

    private initializeErrorHandling(): void {
        this.app.use(errorMiddleware);
    }

    private initializeControllers(controllers: Controller[]): void {
        controllers.forEach((controller) => {
            this.app.use("/", controller.router);
        });
    }
}

export default App;
