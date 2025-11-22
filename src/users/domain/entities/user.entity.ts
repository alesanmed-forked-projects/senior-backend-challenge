import { UserRole } from 'src/users/domain/value-objects/user-role.vo';
import { InvalidUserData } from '../errors/invalid-user-data.error';
import { DateTime } from 'luxon';
import { Email } from '../value-objects/email.vo';

interface UserData {
  id?: number; // Optional, undefined for users not yet persisted
  name: string;
  email: Email;
  password: string;
  role: UserRole;
  createdAt: DateTime;
}

export class User {
  private readonly data: UserData;

  private constructor(
    data: UserData | (Omit<UserData, 'email'> & { email: string }),
  ) {
    this.validate(data);

    this.data = {
      ...data,
      email:
        data.email instanceof Email ? data.email : Email.fromString(data.email),
    };
  }

  static createNew(
    params: Omit<UserData, 'id' | 'createdAt' | 'email'> & { email: string },
  ): User {
    return new User({
      ...params,
      id: undefined,
      createdAt: DateTime.now(),
    });
  }

  static fromData(data: UserData): User {
    return new User(data);
  }

  withId(id: number): User {
    this.data.id = id;

    return this;
  }

  get id(): number | undefined {
    return this.data.id;
  }

  get name(): string {
    return this.data.name;
  }

  get email(): Email {
    return this.data.email;
  }

  get password(): string {
    return this.data.password;
  }

  get role(): UserRole {
    return this.data.role;
  }

  get createdAt(): DateTime {
    return this.data.createdAt;
  }

  private validate(data: Omit<UserData, 'email'>): void {
    this.validateName(data.name);
    this.validateCreatedAt(data.createdAt);
  }

  private validateName(name: string): void {
    if (!name.trim() || name.length > 255) {
      throw new InvalidUserData('name', name);
    }
  }

  private validateCreatedAt(createdAt: DateTime): void {
    if (!createdAt.isValid) {
      throw new InvalidUserData('createdAt', createdAt.invalidReason!);
    }
  }
}
