import HttpException from "./http.exception";

class WrongCredentialsException extends HttpException {
    constructor() {
        super(403, `Wrong credentials`);
    }
}

export default WrongCredentialsException;
