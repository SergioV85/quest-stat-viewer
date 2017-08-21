import { Component } from '@angular/core';
import { ApiService } from './../../common/services/api.service';

@Component({
  selector: 'main-page',
  templateUrl: 'main-page.component.html',
  styleUrls: ['main-page.component.scss']
})
export class MainPageComponent {
  public gameData: QuestStat.GameData;
  public dataRequested: boolean;

  constructor(private apiService: ApiService) {}

  public searchGame(searchRequest: QuestStat.GameRequest) {
    this.dataRequested = true;
    this.apiService.getGameStat(searchRequest)
      .subscribe((data: QuestStat.GameData) => {
        this.dataRequested = false;
        this.gameData = data;
      });
  }

}
