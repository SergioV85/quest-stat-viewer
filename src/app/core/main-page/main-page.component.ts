import { Component } from '@angular/core';
import { MdSnackBar } from '@angular/material';
import { ApiService } from './../../common/services/api.service';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/finally';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'main-page',
  templateUrl: 'main-page.component.html',
  styleUrls: ['main-page.component.scss']
})
export class MainPageComponent {
  public gameData: QuestStat.GameData;
  public dataRequested: boolean;
  public errorMessage: string;

  constructor(private apiService: ApiService, private snackBar: MdSnackBar) {}

  public searchGame(searchRequest: QuestStat.GameRequest) {
    this.dataRequested = true;
    this.apiService.getGameStat(searchRequest)
      .catch((error) => {
        this.snackBar.open('Извините, невозможно обработать запрос', 'Скрыть', {
          politeness: 'assertive',
          duration: 30000,
          extraClasses: ['error-message']
        });
        throw Error(error);
      })
      .finally(() => {
        this.dataRequested = false;
      })
      .subscribe((data: QuestStat.GameData) => {
        this.gameData = data;
      });
  }

}
