import { PipeTransform, Pipe } from '@angular/core';
import { map, path, split } from 'ramda';

@Pipe({ name: 'getProp' })
export class MockedGetPropertyPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public transform(value: any): any {
    return value;
  }
}
