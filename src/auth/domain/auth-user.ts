import { UserRole } from 'src/users/domain/value-objects/user-role.vo';

export interface AuthUser {
  id: number;
  email: string;
  role: UserRole;
}
