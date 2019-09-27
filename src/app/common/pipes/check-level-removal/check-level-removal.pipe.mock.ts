import { PipeTransform, Pipe } from '@angular/core';
import { pathOr } from 'ramda';

@Pipe({ name: 'checkLevelRemoval' })
export class MockedCheckLevelRemovalPipe implements PipeTransform {
  // tslint:disable-next-line: no-any
  public transform(levels: any): false {
    return false;
  }
}
