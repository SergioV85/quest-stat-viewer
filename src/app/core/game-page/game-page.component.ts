import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as R from 'ramda';

@Component({
  selector: 'game-page',
  templateUrl: 'game-page.component.html',
  styleUrls: ['game-page.component.scss']
})
export class GamePageComponent implements OnInit {
  public gameData: QuestStat.GameData;
  public dataRequested: boolean;
  public errorMessage: string;

  constructor(private route: ActivatedRoute) {}

  public ngOnInit() {
    const { gameData } = this.route.snapshot.data;
    this.gameData = gameData;
  }

  public updateLevel(updatedLevel) {
    const levelIdx = R.findIndex(R.propEq('id', updatedLevel.id))(this.gameData.stat.levels);
    const newData = R.adjust((oldLevel) => R.merge(oldLevel, updatedLevel), levelIdx, this.gameData.stat.levels);
    this.gameData.stat.levels = newData;
  }
}
