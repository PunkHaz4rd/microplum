export class PlumError {
    constructor(public status: number, public code: string, public message: string) {
    };
}

export class ParametersPlumError extends PlumError {
    constructor(message: string) {
        super(400, PlumErrorCodes.parameters_error, message);
    }
}

export class UnauthorizedPlumError extends PlumError {
    constructor(message: string = "Unauthorized access") {
        super(401, PlumErrorCodes.unauthorized, message);
    }
}

export class ForbiddenPlumError extends PlumError {
    constructor(message: string = "Access forbidden") {
        super(403, PlumErrorCodes.forbidden, message);
    }
}

export class NotFoundPlumError extends PlumError {
    constructor(message: string = "Entity not found error") {
        super(404, PlumErrorCodes.not_found, message);
    }
}

export class NotAllowedPlumError extends PlumError {
    constructor(message: string = "Method not allowed error", public scope?: any) {
        super(405, PlumErrorCodes.not_allowed, message);
    }
}

export class TimeoutPlumError extends PlumError {
    constructor(message: string = "Method timeout error", public scope?: any) {
        super(408, PlumErrorCodes.timeout, message);
    }
}

export class PreconditionFailedPlumError extends PlumError {
    constructor(message: string = null) {
        super(412, PlumErrorCodes.predondition_error, message);
    }
}

export class FieldError {
    constructor(public code: string, public message: string) {
    }
}

export class ValidationPlumError extends PlumError {
    constructor(public fields: { [key: string]: FieldError; }, message: string = null) {
        super(422, PlumErrorCodes.validation_error, message);
    }
}

export class ServerPlumError extends PlumError {
    constructor(message: string = "Unexpected server error") {
        super(500, PlumErrorCodes.server_error, message);
    }
}

export const transformSenecaError = (err: any): PlumError | any => {
    if (err.seneca && err.details && err.details.message) {
        switch (err.details.message) {
            case "[TIMEOUT]":
                return new TimeoutPlumError(err.msg);
        }
    }
    return err;
};

/** Utility function to create a K:V from a list of strings */
function strEnum<T extends string>(o: Array<T>): {[K in T]: K} {
    return o.reduce((res, key) => {
        res[key] = key;
        return res;
    }, Object.create(null));
}

/** Create a K:V */
export const PlumErrorCodes = strEnum([
    "server_error",
    "not_found",
    "not_allowed",
    "forbidden",
    "timeout",
    "unauthorized",
    "parameters_error",
    "validation_error",
    "predondition_error",
]);
/** Create a Type */
export type PlumErrorCodes = keyof typeof PlumErrorCodes;