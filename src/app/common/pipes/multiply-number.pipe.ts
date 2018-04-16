import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'multiplyNumber'
})
export class MultiplyNumberPipe implements PipeTransform {

  transform(value: number, multiplier?: number): number {
    if (value) {
      return value * multiplier;
    }
    return value;
  }

}