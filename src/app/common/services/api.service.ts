import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class ApiService {
  // private serverAddress: string = 'https://quest-stat-parser.herokuapp.com';
  private serverAddress: string = 'http://localhost:4040';

  constructor(private http: Http) {}

  public getSavedGames(): Observable<QuestStat.GameInfo[]> {
    return this.http
      .get(`${this.serverAddress}/games/`)
      .map((data: any) => data.json());
  }

  public getGameStat(gameData: QuestStat.GameRequest): Observable<QuestStat.GameData> {
    return this.http
      .post(`${this.serverAddress}/games/`, gameData)
      .map((data: any) => data.json());
  }

  public saveLevelSettings({ gameId, levelData}): Observable<QuestStat.GameData> {
    return this.http
      .put(`${this.serverAddress}/games/${gameId}/update-levels`, levelData)
      .map((data: any) => data.json());
  }
}
