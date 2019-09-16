import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { pipe, uniq, filter, propEq, pluck } from 'ramda';

@Component({
  selector: 'saved-games',
  templateUrl: 'saved-games.component.html',
  styleUrls: ['saved-games.component.scss'],
})
export class SavedGamesComponent implements OnInit {
  @Input() public savedGames: QuestStat.GameInfo[];
  @Output() public requestGameData = new EventEmitter<QuestStat.GameRequest>();
  public domains: string[] = [];
  public games: QuestStat.GameInfo[] = [];

  public ngOnInit() {
    this.domains = pipe(
      pluck('Domain'),
      uniq,
    )(this.savedGames);

    this.games = [...this.savedGames];
  }
  public filterByDomain($event) {
    if ($event.value) {
      this.games = filter(propEq('Domain', $event.value))(this.savedGames);
    } else {
      this.games = [...this.savedGames];
    }
  }
  public selectGame(game: QuestStat.GameInfo) {
    const requestedGame = {
      id: game.GameId,
      domain: game.Domain,
    };
    this.requestGameData.emit(requestedGame);
  }
}
