import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { zip } from 'rxjs/operators';
import { ApiService } from './../services/api.service';

@Injectable()
export class GameDataResolver implements Resolve<any> {
  constructor(private apiService: ApiService, private router: Router) {}

  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const domain = route.paramMap.get('domain');
    const id = route.paramMap.get('id');

    return forkJoin([
      this.apiService.getGameStat({ domain, id }),
      this.apiService.getGameStatNoSql({ domain, id })
    ]);
  }
}
