import { Pipe, PipeTransform } from '@angular/core';
import { prop } from 'ramda';

@Pipe({
  name: 'filterByProp',
})
export class FilterByPropPipe implements PipeTransform {
  // tslint:disable-next-line: no-any
  public transform(value: any, property: string): any {
    if (value) {
      return prop(property, value);
    }
    return value;
  }
}
