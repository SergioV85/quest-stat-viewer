import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ApiService {
  private serverAddress: string = 'https://quest-stat-parser.herokuapp.com';

  constructor(private http: Http) {}

  public getGameStat(gameId: number) {
    return this.http
      .get(`${this.serverAddress}/games/${gameId}`)
      .map((data: any) => data.json());
  }
}