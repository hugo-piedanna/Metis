import { BaseDto } from "../model/base.dto";

interface Response {
    message: string;
    data: BaseDto | BaseDto[] | null;
    errors: Error[];
}

interface Error {
    code: string;
    type: "critical" | "informative" | "warning";
}

/**
 * A utility class to build and manage API responses.
 */
export default class ResponseWriter {

    response: Response;

    constructor() {
        this.response = {
            message: '',
            data: null,
            errors: []
        };
    }

    writeMessage(message: string): this {
        this.response.message = message;
        return this;
    }

    writeData(data: BaseDto | BaseDto[] | null): this {
        this.response.data = data;
        return this;
    }

    addError(code: string, type: "critical" | "informative" | "warning"): this {
        this.response.errors.push({ code, type });
        return this;
    }

    writeResponse(): string {
        return JSON.stringify(this.response);
    }
}