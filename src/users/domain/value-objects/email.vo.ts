import { InvalidUserData } from '../errors/invalid-user-data.error';

export class Email {
  private static readonly EMAIL_REGEX =
    /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;

  private constructor(private readonly _email: string) {}

  get email(): string {
    return this._email;
  }

  static fromString(email: string): Email {
    if (!Email.EMAIL_REGEX.test(email)) {
      throw new InvalidUserData('email', email);
    }

    return new Email(email);
  }

  static fromEmail(email: Email): Email {
    return new Email(email.toString());
  }

  equals(other: Email): boolean {
    return this._email === other._email;
  }

  toString(): string {
    return this._email;
  }
}
