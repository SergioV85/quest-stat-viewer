import { PipeTransform, Pipe } from '@angular/core';
import { TeamData } from '@app-common/models';

@Pipe({ name: 'totalStatCalculation' })
export class MockedTotalStatCalculationPipe implements PipeTransform {
  public transform(value: number[]) {
    return 0;
  }
}
