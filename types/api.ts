export interface ApiResponse<T> {
  data: T;
  error?: never;
}

export interface ApiErrorResponse {
  error: string;
  details?: Record<string, string>;
  data?: never;
}

export type ApiResult<T> = ApiResponse<T> | ApiErrorResponse;

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public details?: Record<string, string>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}


