import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/finally';
import { ApiService } from './../../common/services/api.service';
import { isNil } from 'ramda';

@Component({
  selector: 'main-page',
  templateUrl: 'main-page.component.html',
  styleUrls: ['main-page.component.scss']
})
export class MainPageComponent implements OnInit {
  public dataRequested: boolean;
  public savedGames: QuestStat.GameInfo[];

  constructor(private apiService: ApiService, private router: Router, private snackBar: MatSnackBar) {}

  public ngOnInit() {
    this.dataRequested = true;
    this.apiService.getSavedGames()
      .catch((err) => {
        this.snackBar.open('Извините, не удалось загрузить данные', 'Скрыть', {
          politeness: 'assertive',
          duration: 1000,
          extraClasses: ['snack-error-message']
        });
        throw err;
      })
      .finally(() => {
        this.dataRequested = false;
      })
      .subscribe((games: QuestStat.GameInfo[]) => {
        this.savedGames = games;
      });
  }

  public get hasGames() {
    return !isNil(this.savedGames);
  }

  public searchGame(searchRequest: QuestStat.GameRequest, ) {
    this.dataRequested = true;
    this.router.navigate([searchRequest.domain, searchRequest.id]);
  }
}
