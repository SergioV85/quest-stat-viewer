import { PipeTransform, Pipe } from '@angular/core';
import { Duration } from 'luxon';

@Pipe({ name: 'formatDuration' })
export class FormatDurationPipe implements PipeTransform {
  public transform(value: number, countType = 'ms') {
    if (value) {
      const key = countType === 's' ? 'seconds' : 'milliseconds';
      const calculatedObj = { [key]: Math.abs(value) };

      const duration = Duration.fromObject(calculatedObj)
        .shiftTo('days', 'hours', 'minutes', 'seconds', 'milliseconds')
        .toObject();

      const days = duration.days ? `${duration.days} д ` : '';
      const hours = duration.hours ? `${duration.hours} ч ` : '';
      const minutes = duration.minutes ? `${duration.minutes} м ` : '';
      const seconds = duration.seconds ? `${duration.seconds} с ` : '';
      const ms = `${duration.milliseconds} мс`;

      return Duration.fromObject(calculatedObj).as('milliseconds') >= 1000
        ? `${days}${hours}${minutes}${seconds}`
        : `${ms}`;
    }
    return value;
  }
}
