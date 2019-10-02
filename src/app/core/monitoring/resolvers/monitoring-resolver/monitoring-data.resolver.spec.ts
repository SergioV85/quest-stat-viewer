import { TestBed } from '@angular/core/testing';
import { Store, MemoizedSelector } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

import { State } from '@app-common/models';
import { RequestMonitoringAction } from '@app-core/monitoring/actions/monitoring.actions';
import { isDataLoaded } from '@app-core/monitoring/reducers/monitoring.reducer';
import { GameMonitoringResolver } from './monitoring-data.resolver';

describe('Monitoring: GameMonitoringResolver', () => {
  let resolver: GameMonitoringResolver;
  let store$: MockStore<State>;
  let dataLoaded: MemoizedSelector<State, boolean>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore(), GameMonitoringResolver],
    });
    store$ = TestBed.get<Store<State>>(Store);
    dataLoaded = store$.overrideSelector(isDataLoaded, false);
    spyOn(store$, 'dispatch');
    resolver = TestBed.get<GameMonitoringResolver>(GameMonitoringResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  describe('resolve', () => {
    // tslint:disable-next-line: no-any
    const mockActivatedRouteSnapshot: any = {
      parent: {
        parent: {
          paramMap: new Map<string, string>([['domain', 'quest.ua'], ['id', '12345']]),
          params: {
            domain: 'quest.ua',
            id: '12345',
          },
        },
      },
    };
    const action = RequestMonitoringAction({ domain: 'quest.ua', id: '12345' });

    it('should resolve the game details', () => {
      resolver.resolve(mockActivatedRouteSnapshot).subscribe();
      expect(store$.dispatch).toHaveBeenCalledWith(action);
    });
    it('should not call action for game details if it already exist', () => {
      dataLoaded.setResult(true);
      resolver.resolve(mockActivatedRouteSnapshot).subscribe();
      expect(store$.dispatch).not.toHaveBeenCalledWith(action);
    });
  });
});
