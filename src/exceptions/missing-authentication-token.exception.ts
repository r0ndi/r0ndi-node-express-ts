import HttpException from "./http.exception";

class MissingAuthenticationTokenException extends HttpException {
    constructor() {
        super(403, `Missing authentication token`);
    }
}

export default MissingAuthenticationTokenException;
