import type { Request, Response } from 'express';
import type { ApiResponse } from '../../types/api.js';
import { sendResponse } from '../../utils/send-response.js';
import { AuthService } from './auth.service.js';
import type { LoginInput, LoginResult } from './auth.types.js';

export class AuthController {
  constructor(private readonly service = new AuthService()) {}

  login = async (
    req: Request<object, object, LoginInput>,
    res: Response<ApiResponse<LoginResult>>,
  ): Promise<void> => {
    sendResponse(res, { data: await this.service.login(req.body) });
  };
}
