import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { MatSnackBar } from '@angular/material';
import { takeUntil, catchError, finalize } from 'rxjs/operators';
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
import { DeviceService } from '@app-common/services/helpers/device.service';
import { Store, select } from '@ngrx/store';
import * as GameDetailsActions from '@app-common/actions/game-details.actions';
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
      activeTabSelector: 'total'
    });
  }

  public ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public saveChanges() {
    this.store.dispatch(new GameDetailsActions.SaveLevelsTypesAction());
  }

  public refreshData() {
    this.store.dispatch(new GameDetailsActions.GetLatestDataFromEnAction());
  }

  public changeViewType({ value }) {
    this.router.navigate(['./', value], { relativeTo: this.route });
  }

  public changeView(newTab) {
    this.router.navigate(['./', newTab], { relativeTo: this.route });
  }
}
