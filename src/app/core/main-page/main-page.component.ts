import { Component, OnInit } from '@angular/core';
import { ApiService } from './../../common/services/api.service';

@Component({
  selector: 'main-page',
  templateUrl: 'main-page.component.html',
  styleUrls: ['main-page.component.scss']
})
export class MainPageComponent implements OnInit {
  constructor(private apiService: ApiService) {}

  public ngOnInit() {
    console.log('Init Main Page');
  }

  public searchGame(searchRequest: QuestStat.GameRequest) {
    this.apiService.getGameStat(searchRequest)
      .subscribe((data: QuestStat.GameData) => {
        console.log(data);
      });
  }
}
