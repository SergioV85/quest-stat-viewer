import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'formatDuration' })
export class MockedFormatDurationPipe implements PipeTransform {
  public transform(value: number): string {
    return `{value}`;
  }
}
