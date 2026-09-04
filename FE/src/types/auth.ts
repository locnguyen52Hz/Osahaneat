import { Role } from "../enums/Role";

export interface AuthState {
  accessToken: string | null;
  myId: number | null;
  username: string | null;
  role: Role | null;

  isInitializing: boolean;
  isLoading: boolean;

  setAuth: (
    accessToken: string,
    username: string,
    userId: number,
    role: Role,
  ) => void;

  login: (credentials: LoginCredentials) => Promise<Role | undefined>;

  refresh: () => Promise<boolean>;

  clearAuth: () => Promise<boolean>;

  setInitializing: (value: boolean) => void;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
