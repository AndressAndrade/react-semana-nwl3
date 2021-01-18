import { ErrorRequestHandler } from 'express';
import { ValidationError } from 'yup';

class ValidationErrors {
    [propriedade: string]: string[]
};

const errorHandler: ErrorRequestHandler  = (error, request, response, next) => {
    console.error(error);

    if (error instanceof ValidationError) {
        let errors: ValidationErrors = {};
        error.inner.forEach(err => {
            errors[err.path] = err.errors;
        });
        return response.status(400).json({
            message: 'Bad request',
            status: false,
            erro: errors
        });
    }

    return response.status(500).json({
        message: 'Internal server error',
        status: false,
        erro: error.message
    });
}

export default errorHandler;