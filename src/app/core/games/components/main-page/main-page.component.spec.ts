import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { State } from '@app-common/models';
import { mockedGames } from '@app-common/mocks/games.mock';
import { CleanGameDataAction } from '@app-common/actions/game-details.actions';
import { CleanMonitoringDataAction } from '@app-common/actions/monitoring.actions';
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
    store$ = TestBed.get<Store<State>>(Store);
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
      const action = CleanGameDataAction();
      component.ngOnInit();
      expect(store$.dispatch).toHaveBeenCalledWith(action);
    });
    it('should dispatch CleanMonitoringDataAction', () => {
      const action = CleanMonitoringDataAction();
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
