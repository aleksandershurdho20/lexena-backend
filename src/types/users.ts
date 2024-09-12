enum Role {
  Admin = "admin",
  Nurse = "nurse",
  HeadNurse = "head_nurse",
  Receptionist = "receptionist",
}
export interface User {
  id: number;
  name: string;
  lastname: string;
  email: string;
  phone: number;
  password?: string;
  role: Role;
  created_at?: Date;
  updated_at?: Date;
}

export interface UserRegisterRequest {
  name: string;
  lastname: string;
  email: string;
  phone: number;
  role: Role;
}
