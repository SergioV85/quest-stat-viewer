import { PipeTransform, Pipe } from '@angular/core';
import * as moment from 'moment';

@Pipe({ name: 'formatDateTime' })
export class FormatDateTimePipe implements PipeTransform {
  private readonly serverFormat = 'DD.MM.YYYY HH:mm:ss.S';
  private readonly mediumWithSecFormat = 'DD MMM YYYY, HH:mm:ss';
  private readonly longerFormat = 'dd DD MMM YYYY, HH:mm:ss';
  private readonly shortFormat = 'DD MMM YYYY';
  private readonly timeOnly = 'HH:mm:ss';

  public transform(value: string | Date, type: string, parseFromString?: boolean) {
    if (value) {
      const date = parseFromString ? moment(value, this.serverFormat) : moment(value);
      if (date.isValid()) {
        switch (type) {
          case 'longer':
            return date.format(this.longerFormat);
          case 'short':
            return date.format(this.shortFormat);
          case 'time':
            return date.format(this.timeOnly);
          default:
            return date.format(this.mediumWithSecFormat);
        }
      } else {
        return value;
      }
    }
    return value;
  }
}
