import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { pipe, uniq, filter, propEq, pluck } from 'ramda';
import { GameInfo, GameRequest } from '@app-common/models';

@Component({
  selector: 'saved-games',
  templateUrl: 'saved-games.component.html',
  styleUrls: ['saved-games.component.scss'],
})
export class SavedGamesComponent implements OnInit {
  @Input() public savedGames: GameInfo[] = [];
  @Output() public requestGameData = new EventEmitter<GameRequest>();
  public domains: string[] = [];
  public games: GameInfo[] = [];

  public ngOnInit() {
    this.domains = pipe(pluck('Domain'), uniq)(this.savedGames);

    this.games = [...this.savedGames];
  }
  public filterByDomain($event: MatSelectChange) {
    if ($event.value) {
      this.games = filter(propEq('Domain', $event.value))(this.savedGames);
    } else {
      this.games = [...this.savedGames];
    }
  }
  public selectGame(game: GameInfo) {
    const requestedGame = {
      id: game.GameId,
      domain: game.Domain,
    };
    this.requestGameData.emit(requestedGame);
  }
}
