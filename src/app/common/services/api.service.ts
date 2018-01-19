import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class ApiService {
  // private serverAddress = 'https://btbihne3he.execute-api.eu-central-1.amazonaws.com/prod';
  // private serverAddress = 'https://www.quest-stat.me.uk';
  private serverAddress = 'http://localhost:4040';

  constructor(private http: HttpClient) {}

  public getSavedGames() {
    return this.http.get<QuestStat.GameInfo[]>(`${this.serverAddress}/games`);
  }

  public getGameStat(gameData: QuestStat.GameRequest) {
    return this.http.get<QuestStat.GameData>(`${this.serverAddress}/game`, { params: this.convertHttpParams(gameData) });
  }

  public getGameStatNoSql(gameData: QuestStat.GameRequest) {
    return this.http.get<QuestStat.GameData>(`${this.serverAddress}/game/nosql`, { params: this.convertHttpParams(gameData) });
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
