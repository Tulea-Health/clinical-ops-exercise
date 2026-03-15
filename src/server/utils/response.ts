export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T | null;
  message: string;
  timestamp: string;
}

export const createResponse = <T = unknown>(
  success: boolean,
  data: T | null = null,
  message: string = "",
): ApiResponse<T> => ({
  success,
  data,
  message,
  timestamp: new Date().toISOString(),
});

export const successResponse = <T = unknown>(
  data: T,
  message: string = "Success",
): ApiResponse<T> => createResponse(true, data, message);

export const errorResponse = (
  message: string = "Error",
  data: unknown = null,
): ApiResponse => createResponse(false, data, message);
