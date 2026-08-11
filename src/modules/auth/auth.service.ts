import { ApiError } from '../../utils/api-error.js';
import { signToken } from '../../utils/jwt.js';
import { verifyPassword } from '../../utils/password.js';
import { AuthRepository } from './auth.repository.js';
import type { LoginInput } from './auth.types.js';

export class AuthService {
  constructor(private readonly repository = new AuthRepository()) {}

  async login(input: LoginInput): Promise<{ token: string }> {
    const staff = await this.repository.findByEmail(input.email);
    if (
      !staff ||
      !(await verifyPassword(input.password, staff.password_hash))
    ) {
      throw new ApiError(401, 'Invalid email or password');
    }
    return { token: signToken({ staffId: staff.id, email: staff.email }) };
  }
}
