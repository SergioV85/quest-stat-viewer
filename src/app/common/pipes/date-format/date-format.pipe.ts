import { PipeTransform, Pipe } from '@angular/core';
import { DateTime } from 'luxon';

@Pipe({ name: 'formatDateTime' })
export class FormatDateTimePipe implements PipeTransform {
  private readonly serverFormat = 'DD.MM.YYYY HH:mm:ss.S';
  private readonly mediumWithSecFormat = 'DD MMM YYYY, HH:mm:ss';
  private readonly longerFormat = 'dd DD MMM YYYY, HH:mm:ss';
  private readonly shortFormat = 'DD MMM YYYY';
  private readonly timeOnly = 'HH:mm:ss';

  public transform(value: string | Date, type: string, parseFromString?: boolean) {
    if (value) {
      const date = parseFromString
        ? DateTime.fromString(value as string, this.serverFormat)
        : DateTime.fromJSDate(value as Date);
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
