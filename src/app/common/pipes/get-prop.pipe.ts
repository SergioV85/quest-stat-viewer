import { PipeTransform, Pipe } from '@angular/core';
import { map, path, split } from 'ramda';

@Pipe({ name: 'getProp' })
export class GetPropertyPipe implements PipeTransform {

  public transform (value: any, pathToProp: string) {
    if (value) {
      const route = split('-', pathToProp);
      return map(path(route), value);
    }
    return value;
  }
}
