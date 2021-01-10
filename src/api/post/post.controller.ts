import * as express from "express";
import { getRepository } from "typeorm";
import PostNotFoundException from "../../exceptions/post.not-found.exception";
import Controller from "../../interfaces/controller.interface";
import RequestWithUser from "../../interfaces/request-with-user.interface";
import authMiddleware from "../../middlewares/auth.middleware";
import validationMiddleware from "../../middlewares/validation.middleware";
import PostDto from "./post.dto";
import Post from "./post.entity";

class PostController implements Controller {
    public path = "/posts";
    public router = express.Router();
    private postRepository = getRepository(Post);

    constructor() {
        this.initializeRoutes();
    }

    public initializeRoutes() {
        this.router.get(this.path, this.getAllPosts);
        this.router.get(`${this.path}/:id`, this.getPostById);
        this.router.post(this.path, authMiddleware, validationMiddleware(PostDto), this.createPost);
        this.router.patch(`${this.path}/:id`, authMiddleware, validationMiddleware(PostDto, true), this.modifyPost);
        this.router.delete(`${this.path}/:id`, authMiddleware, this.deletePost);
    }

    private getPostById = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id: string = request.params.id;
        const post = await this.postRepository.findOne(id, {relations: ["categories"]});

        if (post) {
            response.send(post);
        } else {
            next(new PostNotFoundException(id));
        }
    }

    private getAllPosts = async (request: express.Request, response: express.Response) => {
        const posts = await this.postRepository.find({relations: ["categories"]});
        response.send(posts);
    }

    private createPost = async (request: RequestWithUser, response: express.Response) => {
        const postData: PostDto = request.body;
        const newPost = this.postRepository.create({
            ...postData,
            author: request.user,
          });

        await this.postRepository.save(newPost);
        newPost.author.password = undefined;
        response.status(201).send(newPost);
    }

    private modifyPost = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id: string = request.params.id;
        const postData: Post = request.body;

        await this.postRepository.update(id, postData);
        const updatedPost = this.postRepository.findOne(id);

        if (updatedPost) {
            response.status(204).send(updatedPost);
        } else {
            next(new PostNotFoundException(id));
        }
    }

    private deletePost = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id: string = request.params.id;
        const deletedResponse = await this.postRepository.delete(id);

        if (deletedResponse.raw[1]) {
            response.sendStatus(200);
        } else {
            next(new PostNotFoundException(id));
        }
    }
}

export default PostController;
