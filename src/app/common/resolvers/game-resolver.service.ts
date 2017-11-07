import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ApiService } from './../services/api.service';

@Injectable()
export class GameDataResolver implements Resolve<QuestStat.GameData> {
  constructor(private apiService: ApiService, private router: Router) {}

  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<QuestStat.GameData> {
    const domain = route.paramMap.get('domain');
    const id = route.paramMap.get('id');

    return this.apiService.getGameStat({ domain, id });
  }
}
