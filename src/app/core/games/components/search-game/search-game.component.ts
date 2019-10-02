import { Component, Output, EventEmitter } from '@angular/core';
import { Validators, FormControl } from '@angular/forms';
import { last, split, pipe, test, find } from 'ramda';
import { GameRequest } from '@app-common/models';

const urlRegex = /(quest.ua|en.cx).*gid=\d+/;

@Component({
  selector: 'search-game',
  templateUrl: 'search-game.component.html',
  styleUrls: ['search-game.component.scss'],
})
export class SearchGameComponent {
  @Output() public requestGameData = new EventEmitter<GameRequest>();
  public gameId: number | null = null;
  public urlInput = new FormControl(null, [Validators.required, Validators.pattern(urlRegex)]);

  public controlHasError(errorType: string): boolean {
    return this.urlInput.hasError(errorType);
  }

  public sendRequest() {
    const gameUrl = this.urlInput.value as string;

    if (!gameUrl) {
      return;
    }

    const domain = this.getUrl(gameUrl);
    const id = pipe(
      split('='),
      last,
      parseInt,
    )(gameUrl);

    this.requestGameData.emit({
      domain,
      id,
    });
  }

  private getUrl(gameUrl: string): string {
    const regex = new RegExp(test(/quest/, gameUrl) ? /quest/ : /en.cx/);

    return pipe(
      split('/'),
      find(test(regex)),
    )(gameUrl) as string;
  }
}
