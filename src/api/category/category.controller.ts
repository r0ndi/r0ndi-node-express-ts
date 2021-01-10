import Category from "./category.entity";
import * as express from "express";
import { getRepository } from "typeorm";
import Controller from "../../interfaces/controller.interface";
import RequestWithUser from "../../interfaces/request-with-user.interface";
import validationMiddlaware from "../../middlewares/validation.middleware";
import CategoryDto from "./category.dto";
import CategoryNotFoundException from "../../exceptions/category.not-found.exception";

class CategoryController implements Controller {
    public path = "/category";
    public router = express.Router();
    private categoryRepository = getRepository(Category);

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, this.getAllCategoires);
        this.router.get(`${this.path}/:id`, this.getCategoryById);
        this.router.post(this.path, validationMiddlaware(CategoryDto), this.createCategory);
    }

    private getAllCategoires = async (request: express.Request, response: express.Response) => {
        const categories = await this.categoryRepository.find({relations: ["posts"]});
        response.send(categories);
    }

    private getCategoryById = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id = request.params.id;
        const category = await this.categoryRepository.findOne(id, {relations: ["posts"]});

        if (category) {
            response.send(category);
        } else {
            next(new CategoryNotFoundException(id));
        }
    }

    private createCategory = async (request: RequestWithUser, response: express.Response) => {
        const categoryData: CategoryDto = request.body;
        const category = this.categoryRepository.create(categoryData);

        await this.categoryRepository.save(category);
        response.status(201).send(category);
    }
}

export default CategoryController;
