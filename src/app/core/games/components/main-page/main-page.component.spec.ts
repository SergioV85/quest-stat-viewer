import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { State } from '@app-common/models';
import { mockedGames } from '@app-common/mocks/games.mock';
import { GAME_DETAILS_ACTIONS } from '@app-core/game-details/actions/game-details.actions';
import { MONITORING_ACTIONS } from '@app-core/monitoring/actions/monitoring.actions';
import { getGames, getLoadingState } from '@app-core/games/reducers/games.reducer';
import { MainPageComponent } from './main-page.component';

describe('Games: MainPageComponent', () => {
  let component: MainPageComponent;
  let fixture: ComponentFixture<MainPageComponent>;
  let store$: MockStore<State>;
  const mockedRouter = {
    navigate: jasmine.createSpy('navigate'),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MainPageComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [provideMockStore(), { provide: Router, useValue: mockedRouter }],
    }).compileComponents();
    store$ = TestBed.inject<Store<State>>(Store) as MockStore<State>;
    store$.overrideSelector(getGames, mockedGames);
    store$.overrideSelector(getLoadingState, false);

    spyOn(store$, 'dispatch');

    fixture = TestBed.createComponent(MainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should dispatch CleanGameDataAction', () => {
      const action = GAME_DETAILS_ACTIONS.cleanGameData();
      component.ngOnInit();
      expect(store$.dispatch).toHaveBeenCalledWith(action);
    });
    it('should dispatch CleanMonitoringDataAction', () => {
      const action = MONITORING_ACTIONS.cleanMonitoringData();
      component.ngOnInit();
      expect(store$.dispatch).toHaveBeenCalledWith(action);
    });
  });

  describe('searchGame', () => {
    it('should call router for navigation to game details', () => {
      component.searchGame({ domain: 'quest.ua', id: 12345 });
      expect(mockedRouter.navigate).toHaveBeenCalledWith(['quest.ua', 12345]);
    });
  });
});
