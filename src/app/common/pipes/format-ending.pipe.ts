import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatEnding',
})
export class FormatEndingPipe implements PipeTransform {
  // tslint:disable-next-line: no-any
  public transform(value: any, word?: string): string {
    if (value) {
      let ending;
      switch (word) {
        case 'страница':
          if (value === 1) {
            ending = 'цу';
          } else if (value > 1 && value < 5) {
            ending = 'цы';
          } else {
            ending = 'ц';
          }
          break;
      }
      return ending;
    }
    return value;
  }
}
