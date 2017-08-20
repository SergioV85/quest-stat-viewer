import { ApiService } from './../../common/services/api.service';
import { Component } from '@angular/core';

@Component({
  selector: 'home',
  styleUrls: [ './home.component.scss' ],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  public gameId: number = null;
  public gameData: QuestStat.GameData;

  constructor(private apiService: ApiService) {}

}
