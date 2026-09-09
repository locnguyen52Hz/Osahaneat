import { FieldErrorMessage } from "../FieldErrorMessage";

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
  token: string | null;
  success: boolean;
  errors: FieldErrorMessage[] | null;
}