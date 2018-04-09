import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { map, tap } from 'rxjs/operators';

const GAMES_KEY = makeStateKey<QuestStat.GameInfo[]>('games');
const GAME_STAT_KEY = makeStateKey<QuestStat.GameData>('game.stat');
const GAME_MONITORING_KEY = makeStateKey<QuestStat.GameData>('game.monitoring');

@Injectable()
export class ApiService {
  private isBrowser: boolean;
  // private serverAddress = 'https://btbihne3he.execute-api.eu-central-1.amazonaws.com/prod';
  private serverAddress = 'http://localhost:3000';

  constructor(@Inject(PLATFORM_ID) private platformId,
              private http: HttpClient,
              private readonly transferState: TransferState) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  public getSavedGames() {
    if (this.isBrowser && this.transferState.hasKey(GAMES_KEY)) {
      const games = this.transferState.get<QuestStat.GameInfo[]>(GAMES_KEY, null);
      this.transferState.remove(GAMES_KEY);
      return of(games);
    }
    return this.http.get<QuestStat.GameInfo[]>(`${this.serverAddress}/games`)
      .pipe(
        tap((response) => {
          if (!this.isBrowser) {
            this.transferState.set<QuestStat.GameInfo[]>(GAMES_KEY, response);
          }
        })
      );
  }

  public getGameStat(gameData: QuestStat.GameRequest) {
    if (this.isBrowser && this.transferState.hasKey(GAME_STAT_KEY)) {
      const singleGame = this.transferState.get<QuestStat.GameData>(GAME_STAT_KEY, null);
      this.transferState.remove(GAME_STAT_KEY);
      return of(singleGame);
    }
    return this.http.get<QuestStat.GameData>(`${this.serverAddress}/game`, { params: this.convertHttpParams(gameData) })
      .pipe(tap((response) => {
        if (!this.isBrowser) {
          this.transferState.set<QuestStat.GameData>(GAME_STAT_KEY, response);
        }
      }));
  }

  public saveLevelSettings({ gameId, levelData }) {
    return this.http.put<QuestStat.LevelData[]>(`${this.serverAddress}/games/${gameId}/update-levels`, levelData, {
      headers: {
        Authorization: 'quest'
      }
    });
  }

  public getMonitoringData(gameData: QuestStat.GameRequest) {
    if (this.isBrowser && this.transferState.hasKey(GAME_MONITORING_KEY)) {
      const gameMonitoring = this.transferState.get<QuestStat.Monitoring.Response>(GAME_MONITORING_KEY, null);
      this.transferState.remove(GAME_MONITORING_KEY);
      return of(gameMonitoring);
    }
    return this.http
      .get<QuestStat.Monitoring.Response>(`${this.serverAddress}/game-monitoring`, { params: this.convertHttpParams(gameData) })
      .pipe(tap((response) => {
        if (!this.isBrowser) {
          this.transferState.set<QuestStat.Monitoring.Response>(GAME_MONITORING_KEY, response);
        }
      }));
  }

  public getMonitoringDetails(request: QuestStat.Monitoring.DetailedMonitoring) {
    return this.http
      .get<QuestStat.Monitoring.Response>(`${this.serverAddress}/game-monitoring-details`, { params: this.convertHttpParams(request) })
      .pipe(tap((response) => {
        if (!this.isBrowser) {
          this.transferState.set<QuestStat.Monitoring.Response>(GAME_MONITORING_KEY, response);
        }
      }));
  }

  private convertHttpParams(gameData: QuestStat.GameRequest | QuestStat.Monitoring.DetailedMonitoring) {
    return JSON.parse(JSON.stringify(gameData));
  }
}
