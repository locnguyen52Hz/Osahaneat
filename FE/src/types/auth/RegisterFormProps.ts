import { FieldValues } from "react-hook-form";
import { AuthField } from "./AuthField";

export interface RegisterFormProps<T extends FieldValues> {
  endpoint: string;
  fields: AuthField<T>[];
  title: string;
  description: string;
  transformData?: (data: T) => unknown;
}
