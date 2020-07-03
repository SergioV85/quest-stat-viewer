import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';

import { takeUntil } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';

import { State, GameData } from '@app-common/models';
import { getActiveTab } from '@app-common/reducers/router/router.reducer';
import { SaveLevelsTypesAction, GetLatestDataFromEnAction } from '@app-core/game-details/actions/game-details.actions';
import { getLoadingState, hasPendingChanges } from '@app-core/game-details/reducers/game-details.reducer';

@Component({
  selector: 'game-page',
  templateUrl: 'game-page.component.html',
  styleUrls: ['game-page.component.scss'],
})
export class GamePageComponent implements OnInit, OnDestroy {
  public activeTab$?: Observable<string>;
  public isGameDataLoading$?: Observable<boolean>;
  public hasPendingChanges$?: Observable<boolean>;

  public tabsForm?: FormGroup;
  public gameData?: GameData;
  public dataRequested = false;
  public errorMessage = '';
  public disableSaveButton = false;
  public loadData = false;
  public selectedView = 'total';
  private readonly ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private readonly store: Store<State>,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly formBuilder: FormBuilder,
  ) {}

  public ngOnInit() {
    this.isGameDataLoading$ = this.store.pipe(select(getLoadingState), takeUntil(this.ngUnsubscribe));
    this.activeTab$ = this.store.pipe(select(getActiveTab), takeUntil(this.ngUnsubscribe));
    this.hasPendingChanges$ = this.store.pipe(select(hasPendingChanges), takeUntil(this.ngUnsubscribe));

    this.tabsForm = this.formBuilder.group({
      activeTabSelector: 'total',
    });
  }

  public ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public saveChanges() {
    this.store.dispatch(SaveLevelsTypesAction());
  }

  public refreshData() {
    this.store.dispatch(GetLatestDataFromEnAction());
  }

  public changeViewType({ value }: { value: string }) {
    this.router.navigate(['./', value], { relativeTo: this.route });
  }

  public changeView(newTab: string) {
    this.router.navigate(['./', newTab], { relativeTo: this.route });
  }
}
