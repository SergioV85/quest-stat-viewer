import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatEnding',
})
export class MockedFormatEndingPipe implements PipeTransform {
  public transform(value: number, word: string): string {
    return word;
  }
}
