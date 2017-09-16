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
      const seconds = modValue >= 1000 ? `${moment.duration(modValue).get('s')} с` : '';
      const ms = `${moment.duration(modValue).get('ms')} мс`;

      return value >= 1000 ? `${days}${hours}${minutes}${seconds}` : `${ms}`;
    }
    return value;
  }
}
