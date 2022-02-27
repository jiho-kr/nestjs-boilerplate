export class ResponsesDataDto<T> {
  statusCode: number;
  message: string;
  code: string;
  data: T;

  constructor(data: T, statusCode = 200, message = 'OK', code = 'SUCCESS') {
    this.data = data;
    this.statusCode = statusCode;
    this.message = message;
    this.code = code;
  }
}
