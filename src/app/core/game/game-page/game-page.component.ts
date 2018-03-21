import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { MatSnackBar } from '@angular/material';
import { debounceTime, distinctUntilChanged, takeUntil, catchError, finalize } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import {
  add,
  adjust,
  ascend,
  clone,
  complement,
  descend,
  difference,
  equals,
  filter,
  find,
  findIndex,
  head,
  isNil,
  map,
  merge,
  mergeDeepRight,
  pathOr,
  pipe,
  prop,
  propEq,
  propOr,
  sortWith,
  subtract,
  update
} from 'ramda';
import { ApiService } from '@app-common/services/api/api.service';
import { DeviceService } from '@app-common/services/helpers/device.service';
import { Store, select } from '@ngrx/store';
import * as GameDetailsReducer from '@app-common/reducers/game-details/game-details.reducer';
import * as RouterReducer from '@app-common/reducers/router/router.reducer';

@Component({
  selector: 'game-page',
  templateUrl: 'game-page.component.html',
  styleUrls: ['game-page.component.scss']
})
export class GamePageComponent implements OnInit, OnDestroy {
  public activeTab$: Observable<string>;
  public isGameDataLoading$: Observable<boolean>;
  public hasPendingChanges$: Observable<boolean>;

  public tabsForm: FormGroup;
  public gameData: QuestStat.GameData;
  public dataRequested: boolean;
  public errorMessage: string;
  public disableSaveButton = false;
  public loadData = false;
  public selectedView = 'total';
  private serverData: QuestStat.GameData;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private store: Store<QuestStat.Store.State>,
              private route: ActivatedRoute,
              private router: Router,
              private formBuilder: FormBuilder,
              private apiService: ApiService,
              private deviceService: DeviceService,
              private snackBar: MatSnackBar) {}

  public ngOnInit() {
    this.isGameDataLoading$ = this.store.pipe(
      select(GameDetailsReducer.getLoadingState),
      takeUntil(this.ngUnsubscribe)
    );
    this.activeTab$ = this.store.pipe(
      select(RouterReducer.getActiveTab),
      takeUntil(this.ngUnsubscribe)
    );
    this.hasPendingChanges$ = this.store.pipe(
      select(GameDetailsReducer.hasPendingChanges),
      takeUntil(this.ngUnsubscribe)
    );

    this.tabsForm = this.formBuilder.group({
      activeTabButtons: 'total',
      activeTabSelector: 'total'
    });
  }

  public ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public saveChanges() {
    this.disableSaveButton = true;
    const gameId = this.gameData.info.GameId;
    const levelData =  this.gameData.stat.Levels;
    this.apiService.saveLevelSettings({ gameId, levelData })
      .pipe(
        takeUntil(this.ngUnsubscribe),
        catchError((err) => {
          this.snackBar.open('Извините, не удалось сохранить данные', 'Скрыть', {
            politeness: 'assertive',
            duration: 1000,
            extraClasses: ['snack-error-message']
          });
          throw err;
        }),
        finalize(() => {
          this.disableSaveButton = false;
        })
      )
      .subscribe((newLevelData) => {
        this.snackBar.open('Данные сохраненны', 'Скрыть', {
          politeness: 'assertive',
          duration: 1000,
          extraClasses: ['snack-success-message']
        });
        this.serverData.stat.Levels = clone(levelData) as QuestStat.LevelData[];
      });
  }

  public refreshData() {
    this.loadData = true;
    const request = Object.assign({}, this.route.snapshot.params as QuestStat.GameRequest, {
      force: true
    });
    this.apiService.getGameStat(request)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        catchError((err) => {
          this.snackBar.open('Извините, не удалось обновить данные', 'Скрыть', {
            politeness: 'assertive',
            duration: 1000,
            extraClasses: ['snack-error-message']
          });
          throw err;
        }),
        finalize(() => {
          this.loadData = false;
        })
      )
      .subscribe((data: QuestStat.GameData) => {
        this.serverData = clone(data);
        this.gameData = data;
      });
  }

  public changeViewType({ value }) {
    this.selectedView = value;
    console.log('changeViewType', value);
    this.router.navigate(['./', value], { relativeTo: this.route });
    if (value === 'monitoring') {
      this.getMonitoringData();
    }
  }

  public changeView(newTab) {
    this.router.navigate(['./', newTab], { relativeTo: this.route });
  }


  private getMonitoringData() {
    const request = Object.assign({}, this.route.snapshot.params as QuestStat.GameRequest);
    this.apiService.getMonitoringData(request)
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe((data) => {
        console.log('Monitoring data', data);
      });
  }
}
