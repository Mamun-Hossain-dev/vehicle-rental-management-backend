export interface StaffRecord {
  id: number;
  email: string;
  password_hash: string;
  name: string;
}

export interface LoginInput {
  email: string;
  password: string;
}
