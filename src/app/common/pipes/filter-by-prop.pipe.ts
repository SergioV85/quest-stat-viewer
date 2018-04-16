import { Pipe, PipeTransform } from '@angular/core';
import { path, prop } from 'ramda';

@Pipe({
  name: 'filterByProp'
})
export class FilterByPropPipe implements PipeTransform {

  public transform(value: any, property: string): any {
    if (value) {
      return prop(property, value);
    }
    return value;
  }

}
