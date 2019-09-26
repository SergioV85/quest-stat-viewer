import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { of, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from './../../../../environments/environment';

const GAMES_KEY = makeStateKey<QuestStat.GameInfo[]>('games');
const GAME_STAT_KEY = makeStateKey<QuestStat.GameData>('game.stat');
const GAME_MONITORING_KEY = makeStateKey<QuestStat.GameData>('game.monitoring');

@Injectable()
export class ApiService {
  private isBrowser: boolean;
  private serverAddress = environment.serverAddress;

  constructor(
    @Inject(PLATFORM_ID) private platformId: string,
    private readonly http: HttpClient,
    private readonly transferState: TransferState,
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  public getSavedGames(): Observable<QuestStat.GameInfo[] | null> {
    if (this.isBrowser && this.transferState.hasKey(GAMES_KEY)) {
      const games = this.transferState.get<QuestStat.GameInfo[] | null>(GAMES_KEY, null);
      this.transferState.remove(GAMES_KEY);
      return of(games);
    }
    return this.http.get<QuestStat.GameInfo[]>(`${this.serverAddress}/games`).pipe(
      tap(response => {
        if (!this.isBrowser) {
          this.transferState.set<QuestStat.GameInfo[]>(GAMES_KEY, response);
        }
      }),
    );
  }

  public getGameStat(gameData: QuestStat.GameRequest) {
    if (this.isBrowser && this.transferState.hasKey(GAME_STAT_KEY)) {
      const singleGame = this.transferState.get<QuestStat.GameData | null>(GAME_STAT_KEY, null);
      this.transferState.remove(GAME_STAT_KEY);
      return of(singleGame);
    }
    return this.http
      .get<QuestStat.GameData>(`${this.serverAddress}/game`, { params: this.convertHttpParams(gameData) })
      .pipe(
        tap(response => {
          if (!this.isBrowser) {
            this.transferState.set<QuestStat.GameData>(GAME_STAT_KEY, response);
          }
        }),
      );
  }

  public saveLevelSettings({ gameId, levelData }: { gameId: number; levelData: QuestStat.LevelData[] }) {
    return this.http.put<QuestStat.LevelData[]>(`${this.serverAddress}/games/${gameId}/update-levels`, levelData, {
      headers: {
        Authorization: 'quest',
      },
    });
  }

  public getMonitoringData(gameData: QuestStat.GameRequest) {
    if (this.isBrowser && this.transferState.hasKey(GAME_MONITORING_KEY)) {
      const gameMonitoring = this.transferState.get<QuestStat.Monitoring.Response | null>(GAME_MONITORING_KEY, null);
      this.transferState.remove(GAME_MONITORING_KEY);
      return of(gameMonitoring);
    }
    return this.http
      .get<QuestStat.Monitoring.Response>(`${this.serverAddress}/game-monitoring`, {
        params: this.convertHttpParams(gameData),
      })
      .pipe(
        tap(response => {
          if (!this.isBrowser) {
            this.transferState.set<QuestStat.Monitoring.Response>(GAME_MONITORING_KEY, response);
          }
        }),
      );
  }

  public getMonitoringDetails(request: Partial<QuestStat.Monitoring.DetailedMonitoring>) {
    return this.http
      .get<QuestStat.Monitoring.Response>(`${this.serverAddress}/game-monitoring-details`, {
        params: this.convertHttpParams(request),
      })
      .pipe(
        tap(response => {
          if (!this.isBrowser) {
            this.transferState.set<QuestStat.Monitoring.Response>(GAME_MONITORING_KEY, response);
          }
        }),
      );
  }

  public getListOfCodes(request: QuestStat.Monitoring.CodesListRequest) {
    return this.http
      .get<QuestStat.Monitoring.CodesListResponse>(`${this.serverAddress}/game-monitoring-codes-list`, {
        params: this.convertHttpParams(request),
      })
      .pipe(
        tap(response => {
          if (!this.isBrowser) {
            this.transferState.set<QuestStat.Monitoring.CodesListResponse>(GAME_MONITORING_KEY, response);
          }
        }),
      );
  }

  private convertHttpParams(
    gameData: Partial<
      QuestStat.GameRequest | QuestStat.Monitoring.DetailedMonitoring | QuestStat.Monitoring.CodesListRequest
    >,
  ) {
    return JSON.parse(JSON.stringify(gameData));
  }
}
