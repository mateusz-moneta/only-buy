export interface RegisterRequest {
  avatar?: File | null;
  email: string;
  password: string;
  username: string;
}
