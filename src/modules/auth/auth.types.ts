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

export interface StaffPublic {
  id: number;
  email: string;
  name: string;
  created_at: Date;
}

export interface LoginResult {
  access_token: string;
  staff: StaffPublic & { role: 'staff' };
}
