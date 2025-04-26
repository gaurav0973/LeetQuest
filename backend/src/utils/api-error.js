export class ApiError{
    constructor(statusCode, message="Error"){
        this.statusCode = statusCode,
        this.message = message,
        this.success = statusCode >= 400
    }
}
