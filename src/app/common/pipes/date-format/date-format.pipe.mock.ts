import { PipeTransform, Pipe } from '@angular/core';
import { DateTime } from 'luxon';

@Pipe({ name: 'formatDateTime' })
export class MockedFormatDateTimePipe implements PipeTransform {
  // tslint:disable-next-line: no-any
  public transform(value: any): any {
    return value;
  }
}
