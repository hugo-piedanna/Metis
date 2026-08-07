interface Response {
  message: string;
  data: any | any[] | null;
  errors: Error[];
}

interface Error {
  code: string;
  type: 'critical' | 'informative' | 'warning';
}

/**
 * A utility class to build and manage API responses.
 */
export default class ResponseWriter<T> {
  response: Response;

  constructor() {
    this.response = {
      message: '',
      data: null,
      errors: [],
    };
  }

  writeMessage(message: string): this {
    this.response.message = message;
    return this;
  }

  writeData(data: T | T[] | null): this {
    this.response.data = data;
    return this;
  }

  addErrors(
    errors: { code: string; type: 'critical' | 'informative' | 'warning' }[],
  ): this {
    this.response.errors.push(...errors);
    return this;
  }

  writeResponse() {
    return this.response;
  }
}
