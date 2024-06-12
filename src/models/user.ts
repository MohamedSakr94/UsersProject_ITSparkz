export interface LoginDTO {
  email: string;
  password: string;
}
export interface RegisterDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isAdmin: boolean;
  isDisabled: boolean;
}
export interface UserReadDTO {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isAdmin: boolean;
  isDisabled: boolean;
}
export interface UpdateDTO {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isAdmin: boolean;
  isDisabled: boolean;
}
export interface SearchDTO {
  name: string;
  role: boolean;
  state: boolean;
}
export interface ChangePasswordDTO {
  id: string;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}
