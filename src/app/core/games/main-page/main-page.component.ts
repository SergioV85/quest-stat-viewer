import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { takeUntil, catchError, finalize } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import { Store, select } from '@ngrx/store';
import { isNil } from 'ramda';
import { ApiService } from '@app-common/services/api/api.service';
import * as GamesReducer from '@app-common/reducers/games/games.reducer';

@Component({
  selector: 'main-page',
  templateUrl: 'main-page.component.html',
  styleUrls: ['main-page.component.scss']
})
export class MainPageComponent implements OnInit {
  public isGamesLoading$: Observable<boolean>;
  public savedGames$: Observable<QuestStat.GameInfo[]>;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private store: Store<QuestStat.Store.State>,
              private apiService: ApiService,
              private router: Router,
              private snackBar: MatSnackBar) {}

  public ngOnInit() {
    this.isGamesLoading$ = this.store.pipe(
      select(GamesReducer.getLoadingState),
      takeUntil(this.ngUnsubscribe)
    );
    this.savedGames$ = this.store.pipe(
      select(GamesReducer.getGames),
      takeUntil(this.ngUnsubscribe)
    );
  }

  public searchGame(searchRequest: QuestStat.GameRequest, ) {
    this.router.navigate([searchRequest.domain, searchRequest.id]);
  }
}
