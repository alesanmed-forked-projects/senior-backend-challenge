import { InvalidUrl } from '../errors/invalid-url.error';

export class Url {
  static readonly regex = new RegExp(
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\\+.~#?&\\/\\/=]*)/,
  );

  private constructor(private readonly _url: string) {}

  get url(): string {
    return this._url;
  }

  static fromString(url: string): Url {
    if (!Url.regex.test(url)) {
      throw new InvalidUrl(url);
    }

    return new Url(url);
  }

  static fromUrl(url: Url): Url {
    return new Url(url.toString());
  }

  equals(other: Url): boolean {
    return this._url === other._url;
  }

  toString(): string {
    return this._url;
  }
}
