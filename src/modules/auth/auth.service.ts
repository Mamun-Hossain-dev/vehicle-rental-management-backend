import { ApiError } from '../../utils/api-error.js';
import { signToken } from '../../utils/jwt.js';
import { hashPassword, verifyPassword } from '../../utils/password.js';
import { AuthRepository } from './auth.repository.js';
import type { LoginInput, RegisterInput, StaffPublic } from './auth.types.js';

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

  async register(input: RegisterInput): Promise<StaffPublic> {
    if (await this.repository.findByEmail(input.email)) {
      throw new ApiError(409, 'A staff account with this email already exists');
    }
    return this.repository.create({
      name: input.name,
      email: input.email,
      password_hash: await hashPassword(input.password),
    });
  }
}
