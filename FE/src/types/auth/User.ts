import { Role } from "../../enums/Role";


export interface User {
  id: number;
  email: string;
  role: Role;
  fullName: string;
}
