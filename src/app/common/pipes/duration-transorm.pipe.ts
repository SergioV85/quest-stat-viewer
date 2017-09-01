import { PipeTransform, Pipe } from '@angular/core';
import * as R from 'ramda';
import * as  moment from 'moment';

@Pipe({ name: 'formatDuration' })
export class FormatDurationPipe implements PipeTransform {

  public transform (value: number) {
    if (value) {
      const modValue = Math.abs(value);
      const days = modValue >= 86400000 ? `${moment.duration(modValue).get('d')} д ` : '';
      const hours = modValue >= 3600000 ? `${moment.duration(modValue).get('h')} ч ` : '';
      const minutes = modValue >= 60000 ? `${moment.duration(modValue).get('m')} м ` : '';
      const seconds = `${moment.duration(modValue).get('s')} с`;

      return `${days}${hours}${minutes}${seconds}`;
    }
    return value;
  }
}
