import { Role } from './role';
import type { School } from './school';

export type User = {
  id: string;
  name: string;
};

export interface UserData {
  uuid: string;
  email: string;
  fullName: string;
  role: Role;
  school: School;
  isActive: boolean;
  isEmailVerified: boolean;
  avatar: string;
}
