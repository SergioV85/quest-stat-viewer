import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import * as R from 'ramda';

@Component({
  selector: 'saved-games',
  templateUrl: 'saved-games.component.html',
  styleUrls: ['saved-games.component.scss']
})
export class SavedGamesComponent implements OnInit {
  @Input() public savedGames: QuestStat.GameInfo[];
  @Output() public requestGameData = new EventEmitter<QuestStat.GameRequest>();
  public domains: string[] = [];
  public games: QuestStat.GameInfo[] = [];

  public ngOnInit() {
    this.domains = R.pipe(
      R.map(R.prop('domain')),
      R.uniq
    )(this.savedGames) as string[];

    this.games = [...this.savedGames];
  }
  public filterByDomain($event) {
    if ($event.value) {
      this.games = R.filter(R.propEq('domain', $event.value))(this.savedGames);
    } else {
      this.games = [...this.savedGames];
    }
  }
  public selectGame(game: QuestStat.GameInfo) {
    this.requestGameData.emit(game);
  }
}
