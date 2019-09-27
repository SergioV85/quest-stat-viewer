import { PipeTransform, Pipe } from '@angular/core';
import { map, path, split } from 'ramda';

@Pipe({ name: 'getProp' })
export class MockedGetPropertyPipe implements PipeTransform {
  // tslint:disable-next-line: no-any
  public transform(value: any): any {
    return value;
  }
}
