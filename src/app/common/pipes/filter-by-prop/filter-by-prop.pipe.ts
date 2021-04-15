import { Pipe, PipeTransform } from '@angular/core';
import { prop } from 'ramda';

@Pipe({
  name: 'filterByProp',
})
export class FilterByPropPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public transform(value: any, property: string): any {
    if (value) {
      return prop(property, value);
    }
    return value;
  }
}
