import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { map, tap } from 'rxjs/operators';

const GAMES_KEY = makeStateKey<QuestStat.GameInfo[]>('games');
const GAME_KEY = makeStateKey<QuestStat.GameData>('game');

@Injectable()
export class ApiService {
  private isBrowser: boolean;
  private serverAddress = 'https://btbihne3he.execute-api.eu-central-1.amazonaws.com/prod';

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
    if (this.isBrowser && this.transferState.hasKey(GAME_KEY)) {
      const singleGame = this.transferState.get<QuestStat.GameData>(GAME_KEY, null);
      this.transferState.remove(GAME_KEY);
      return of(singleGame);
    }
    return this.http.get<QuestStat.GameData>(`${this.serverAddress}/game`, { params: this.convertHttpParams(gameData) })
      .pipe(tap((response) => {
        if (!this.isBrowser) {
          this.transferState.set<QuestStat.GameData>(GAME_KEY, response);
        }
      }));
  }

  public saveLevelSettings({ gameId, levelData}) {
    return this.http.put<QuestStat.LevelData[]>(`${this.serverAddress}/games/${gameId}/update-levels`, levelData, {
      headers: {
        Authorization: 'quest'
      }
    });
  }

  private convertHttpParams(gameData: QuestStat.GameRequest) {
    return JSON.parse(JSON.stringify(gameData));
  }
}
