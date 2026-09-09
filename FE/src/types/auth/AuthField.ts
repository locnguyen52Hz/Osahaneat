import { FieldPath, FieldValues, RegisterOptions } from "react-hook-form";

export interface AuthField<T extends FieldValues> {
  name: FieldPath<T>;
  id: string;
  label: string;
  placeholder?: string;
  type: string;
  icon: string;
  autoComplete?: string;
  accept?: string;
  rules?: RegisterOptions<T, FieldPath<T>>;
}
