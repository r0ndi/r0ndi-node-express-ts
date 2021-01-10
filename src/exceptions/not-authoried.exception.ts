import HttpException from "./http.exception";

class NotAuthorizedException extends HttpException {
    constructor() {
        super(403, `Not authorized`);
    }
}

export default NotAuthorizedException;
