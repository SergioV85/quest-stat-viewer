import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatEnding',
})
export class FormatEndingPipe implements PipeTransform {
  // tslint:disable-next-line: no-any
  public transform(value: any, word?: string): string {
    if (value) {
      return word === 'страница' ? this.getEndingForPage(value) : word;
    }
    return value;
  }

  private getEndingForPage(value: number) {
    switch (true) {
      case value === 1:
        return 'цу';
      case value > 1 && value < 5:
        return 'цы';
      default:
        return 'ц';
    }
  }
}
