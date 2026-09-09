import { User } from "./User";

export interface LoginResponse {
  accessToken: string;
  user: Omit<User, "role">;
}
