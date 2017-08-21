import { PipeTransform, Pipe } from '@angular/core';
import * as  moment from 'moment';

@Pipe({ name: 'formatDuration' })
export class FormatDurationPipe implements PipeTransform {

  public transform (value: number) {
    if (value) {
      const days = value >= 86400000 ? `${moment.duration(value).get('d')} д ` : '';
      const hours = value >= 3600000 ? `${moment.duration(value).get('h')} ч ` : '';
      const minutes = value >= 60000 ? `${moment.duration(value).get('m')} м ` : '';
      const seconds = `${moment.duration(value).get('s')} с`;

      return `${days}${hours}${minutes}${seconds}`;
    }
    return value;
  }
}
