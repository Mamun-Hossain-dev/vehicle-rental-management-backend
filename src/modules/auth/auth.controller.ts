import type { Request, Response } from 'express';
import { AuthService } from './auth.service.js';
import type { LoginInput, RegisterInput } from './auth.types.js';

export class AuthController {
  constructor(private readonly service = new AuthService()) {}

  login = async (
    req: Request<object, object, LoginInput>,
    res: Response,
  ): Promise<void> => {
    res.json({ success: true, data: await this.service.login(req.body) });
  };

  register = async (
    req: Request<object, object, RegisterInput>,
    res: Response,
  ): Promise<void> => {
    res.status(201).json({
      success: true,
      message: 'Staff registered successfully',
      data: await this.service.register(req.body),
    });
  };
}
