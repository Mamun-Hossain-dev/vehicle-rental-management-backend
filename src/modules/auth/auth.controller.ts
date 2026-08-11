import type { Request, Response } from 'express';
import { AuthService } from './auth.service.js';
import type { LoginInput } from './auth.types.js';

export class AuthController {
  constructor(private readonly service = new AuthService()) {}

  login = async (
    req: Request<object, object, LoginInput>,
    res: Response,
  ): Promise<void> => {
    res.json({ success: true, data: await this.service.login(req.body) });
  };
}
