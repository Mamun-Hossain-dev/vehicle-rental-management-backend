export interface StaffRecord {
  id: number;
  email: string;
  password_hash: string;
  name: string;
  created_at: Date;
  updated_at: Date;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput extends LoginInput {
  name: string;
}

export interface StaffPublic {
  id: number;
  email: string;
  name: string;
  created_at: Date;
}
