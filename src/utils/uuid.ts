import { v4 as uuid } from 'uuid';

export class UuidUtil {
  public static generate(): string {
    return uuid();
  }
}
