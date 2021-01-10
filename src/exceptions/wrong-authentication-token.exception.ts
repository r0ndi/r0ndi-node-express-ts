import HttpException from "./http.exception";

class WrongAuthenticationTokenException extends HttpException {
    constructor() {
        super(403, `Wrong authentication token`);
    }
}

export default WrongAuthenticationTokenException;
