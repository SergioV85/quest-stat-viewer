import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { GameInfo, State, GameRequest } from '@app-common/models';
import { GAME_DETAILS_ACTIONS } from '@app-core/game-details/actions/game-details.actions';
import { MONITORING_ACTIONS } from '@app-core/monitoring/actions/monitoring.actions';
import { getLoadingState, getGames } from '@app-core/games/reducers/games.reducer';

@Component({
  selector: 'main-page',
  templateUrl: 'main-page.component.html',
  styleUrls: ['main-page.component.scss'],
})
export class MainPageComponent implements OnInit, OnDestroy {
  public isGamesLoading$?: Observable<boolean>;
  public savedGames$?: Observable<GameInfo[]>;
  private readonly ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private readonly store: Store<State>, private readonly router: Router) {}

  public ngOnInit() {
    this.isGamesLoading$ = this.store.pipe(select(getLoadingState), takeUntil(this.ngUnsubscribe));
    this.savedGames$ = this.store.pipe(select(getGames), takeUntil(this.ngUnsubscribe));
    this.store.dispatch(GAME_DETAILS_ACTIONS.cleanGameData());
    this.store.dispatch(MONITORING_ACTIONS.cleanMonitoringData());
  }

  public ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public searchGame(searchRequest: GameRequest) {
    this.router.navigate([searchRequest.domain, searchRequest.id]);
  }
}
