export class ApiResponse{
    constructor(statusCode, message="succeess", data){
        this.statusCode = statusCode,
        this.message = message,
        this.data = data,
        this.success = statusCode < 400
    }
}

