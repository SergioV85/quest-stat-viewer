import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class ApiService {
  // private serverAddress: string = 'https://quest-stat-parser.herokuapp.com';
  private serverAddress: string = 'http://localhost:4040';

  constructor(private http: Http) {}

  public getGameStat(gameData: QuestStat.GameRequest): Observable<QuestStat.GameData> {
    return this.http
      .post(`${this.serverAddress}/games/`, gameData)
      .map((data: any) => data.json());
  }
}