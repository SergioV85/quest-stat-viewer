import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { of, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from './../../../../environments/environment';
import {
  GameInfo,
  GameData,
  MonitoringResponse,
  LevelData,
  GameRequest,
  DetailedMonitoring,
  CodesListRequest,
  CodesListResponse,
} from '@app-common/models';

const GAMES_KEY = makeStateKey<GameInfo[]>('games');
const GAME_STAT_KEY = makeStateKey<GameData>('game.stat');
const GAME_MONITORING_KEY = makeStateKey<GameData>('game.monitoring');

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly isBrowser: boolean;
  private readonly serverAddress = environment.serverAddress;

  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: string,
    private readonly http: HttpClient,
    private readonly transferState: TransferState,
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  public getSavedGames(): Observable<GameInfo[] | null> {
    if (this.isBrowser && this.transferState.hasKey(GAMES_KEY)) {
      const games = this.transferState.get<GameInfo[] | null>(GAMES_KEY, null);
      this.transferState.remove(GAMES_KEY);
      return of(games);
    }
    return this.http.get<GameInfo[]>(`${this.serverAddress}/games`).pipe(
      tap(response => {
        if (!this.isBrowser) {
          this.transferState.set<GameInfo[]>(GAMES_KEY, response);
        }
      }),
    );
  }

  public getGameStat(gameData: GameRequest) {
    if (this.isBrowser && this.transferState.hasKey(GAME_STAT_KEY)) {
      const singleGame = this.transferState.get<GameData | null>(GAME_STAT_KEY, null);
      this.transferState.remove(GAME_STAT_KEY);
      return of(singleGame);
    }
    return this.http.get<GameData>(`${this.serverAddress}/game`, { params: this.convertHttpParams(gameData) }).pipe(
      tap(response => {
        if (!this.isBrowser) {
          this.transferState.set<GameData>(GAME_STAT_KEY, response);
        }
      }),
    );
  }

  public saveLevelSettings({ gameId, levelData }: { gameId: number; levelData: LevelData[] }) {
    return this.http.put<LevelData[]>(`${this.serverAddress}/games/${gameId}/update-levels`, levelData, {
      headers: {
        Authorization: 'quest',
      },
    });
  }

  public getMonitoringData(gameData: GameRequest) {
    if (this.isBrowser && this.transferState.hasKey(GAME_MONITORING_KEY)) {
      const gameMonitoring = this.transferState.get<MonitoringResponse | null>(GAME_MONITORING_KEY, null);
      this.transferState.remove(GAME_MONITORING_KEY);
      return of(gameMonitoring);
    }
    return this.http
      .get<MonitoringResponse>(`${this.serverAddress}/game-monitoring`, {
        params: this.convertHttpParams(gameData),
      })
      .pipe(
        tap(response => {
          if (!this.isBrowser) {
            this.transferState.set<MonitoringResponse>(GAME_MONITORING_KEY, response);
          }
        }),
      );
  }

  public getMonitoringDetails(request: Partial<DetailedMonitoring>) {
    return this.http
      .get<MonitoringResponse>(`${this.serverAddress}/game-monitoring-details`, {
        params: this.convertHttpParams(request),
      })
      .pipe(
        tap(response => {
          if (!this.isBrowser) {
            this.transferState.set<MonitoringResponse>(GAME_MONITORING_KEY, response);
          }
        }),
      );
  }

  public getListOfCodes(request: CodesListRequest) {
    return this.http
      .get<CodesListResponse>(`${this.serverAddress}/game-monitoring-codes-list`, {
        params: this.convertHttpParams(request),
      })
      .pipe(
        tap(response => {
          if (!this.isBrowser) {
            this.transferState.set<CodesListResponse>(GAME_MONITORING_KEY, response);
          }
        }),
      );
  }

  private convertHttpParams(gameData: Partial<GameRequest | DetailedMonitoring | CodesListRequest>) {
    return JSON.parse(JSON.stringify(gameData));
  }
}
