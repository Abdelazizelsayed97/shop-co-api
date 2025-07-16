class ApiErrorHandler extends Error {

    constructor(message: string, statusCode: string, isOperational: boolean, stack: string) {
        super(message);
        statusCode;
        isOperational = true;
        stack
    }
}