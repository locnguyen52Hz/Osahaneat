import { ReactNode } from "react";

import { FieldErrorMessage } from "../FieldErrorMessage";
import { AuthField } from "./AuthField";
import { FieldValues } from "react-hook-form";

export interface AuthFormProps<T extends FieldValues> {
  title: string;
  description: string;
  onSubmit: (data: T) => Promise<boolean>;
  fields: AuthField<T>[];
  submitLabel: string;
  externalErrors: FieldErrorMessage[];
  options?: ReactNode;
}
