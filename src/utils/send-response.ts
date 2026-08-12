import type { Response } from 'express';
import type { ApiResponse } from '../types/api.js';

type ResponseOptions<T> = Omit<ApiResponse<T>, 'success'> & {
  success?: boolean;
  status?: number;
};

export const sendResponse = <T>(
  res: Response<ApiResponse<T>>,
  { success = true, status = 200, ...payload }: ResponseOptions<T>,
): void => {
  res.status(status).json({ success, ...payload });
};
