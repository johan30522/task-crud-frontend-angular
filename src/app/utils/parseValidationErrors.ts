import { ErrorResponse } from "../shared/interfaces/interfaces";

export function parseValidationErrors(error: ErrorResponse): { [key: string]: string } {
    const errorMessages: { [key: string]: string } = {};
    error.validationErrorList.forEach(validationError => {
        errorMessages[validationError.field] = validationError.message;
    });
    return errorMessages;
}