import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import { Store, select } from '@ngrx/store';
import * as GameDetailsAction from '@app-common/actions/game-details.actions';
import * as MonitoringAction from '@app-common/actions/monitoring.actions';
import * as GamesReducer from '@app-common/reducers/games/games.reducer';

@Component({
  selector: 'main-page',
  templateUrl: 'main-page.component.html',
  styleUrls: ['main-page.component.scss']
})
export class MainPageComponent implements OnInit, OnDestroy {
  public isGamesLoading$: Observable<boolean>;
  public savedGames$: Observable<QuestStat.GameInfo[]>;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private store: Store<QuestStat.Store.State>,
              private router: Router) {}

  public ngOnInit() {
    this.isGamesLoading$ = this.store.pipe(
      select(GamesReducer.getLoadingState),
      takeUntil(this.ngUnsubscribe)
    );
    this.savedGames$ = this.store.pipe(
      select(GamesReducer.getGames),
      takeUntil(this.ngUnsubscribe)
    );
    this.store.dispatch(new GameDetailsAction.CleanGameDataAction());
    this.store.dispatch(new MonitoringAction.CleanMonitoringDataAction());
  }

  public ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public searchGame(searchRequest: QuestStat.GameRequest, ) {
    this.router.navigate([searchRequest.domain, searchRequest.id]);
  }
}
