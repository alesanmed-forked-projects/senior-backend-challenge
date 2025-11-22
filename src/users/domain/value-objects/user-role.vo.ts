import { InvalidUserRole } from 'src/users/domain/errors/invalid-user-role.error';
import { Role } from 'src/users/domain/value-objects/role.enum';

export class UserRole {
  private constructor(private readonly _role: Role) {}

  get role(): Role {
    return this._role;
  }

  static fromString(role: string): UserRole {
    if (!Object.values(Role).includes(role as Role)) {
      throw new InvalidUserRole(role);
    }

    return new UserRole(Role[role as keyof typeof Role]);
  }

  static fromRole(role: Role): UserRole {
    return new UserRole(role);
  }

  equals(other: UserRole): boolean {
    return this._role === other._role;
  }

  toString(): string {
    return this._role;
  }
}
