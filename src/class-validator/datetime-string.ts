import type { ValidatorConstraintInterface } from 'class-validator';
import { ValidatorConstraint } from 'class-validator';

@ValidatorConstraint({ name: 'datetimeString', async: false })
export class DatetimeString implements ValidatorConstraintInterface {
  validate(value: string): boolean {
    if (typeof value === 'string') {
      return /\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]) (2[0-3]|[01]\d)(?::[0-5]\d){2}/.test(
        value,
      );
    }
    return false;
  }

  defaultMessage({ property }: { property: string }): string {
    return `${property} must be a valid date (Required format: YYYY-MM-DD)`;
  }
}
