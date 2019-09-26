import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'multiplyNumber',
})
export class MultiplyNumberPipe implements PipeTransform {
  public transform(value: number, multiplier?: number): number {
    if (value && multiplier) {
      return value * multiplier;
    }
    return value;
  }
}
