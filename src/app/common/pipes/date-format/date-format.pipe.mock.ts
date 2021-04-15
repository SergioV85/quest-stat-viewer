import { PipeTransform, Pipe } from '@angular/core';
import { DateTime } from 'luxon';

@Pipe({ name: 'formatDateTime' })
export class MockedFormatDateTimePipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public transform(value: any): any {
    return value;
  }
}
