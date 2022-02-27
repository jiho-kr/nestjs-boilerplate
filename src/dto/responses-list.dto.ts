export class ResponsesListDto<T> {
  statusCode: number;
  message: string;
  code: string;
  data: {
    total: number;
    list: T[];
  };

  constructor(list: T[], statusCode = 200, message = 'OK', code = 'SUCCESS') {
    this.data = { total: list.length, list };
    this.statusCode = statusCode;
    this.message = message;
    this.code = code;
  }
}
