import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'checkLevelRemoval' })
export class MockedCheckLevelRemovalPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public transform(levels: any): false {
    return false;
  }
}
