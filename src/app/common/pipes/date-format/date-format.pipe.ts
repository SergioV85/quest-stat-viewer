import { PipeTransform, Pipe } from '@angular/core';
import { DateTime } from 'luxon';

@Pipe({ name: 'formatDateTime' })
export class FormatDateTimePipe implements PipeTransform {
  private readonly mediumWithSecFormat = 'dd LLL yyyy, HH:mm:ss';
  private readonly longerFormat = 'DD dd LLL yyyy, HH:mm:ss';
  private readonly shortFormat = 'dd LLL yyyy';
  private readonly timeOnly = 'HH:mm:ss';

  public transform(value: string | Date, type: string, parseFromString = false) {
    if (value) {
      const date = parseFromString ? DateTime.fromISO(value as string) : DateTime.fromJSDate(value as Date);
      if (date.isValid) {
        switch (type) {
          case 'longer':
            return date.toFormat(this.longerFormat);
          case 'short':
            return date.toFormat(this.shortFormat);
          case 'time':
            return date.toFormat(this.timeOnly);
          default:
            return date.toFormat(this.mediumWithSecFormat);
        }
      } else {
        return value;
      }
    }
    return value;
  }
}
