import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { State } from '@app-common/models';
import { mockedGames } from '@app-common/mocks/games.mock';
import { getActiveTab } from '@app-common/reducers/router/router.reducer';
import { SaveLevelsTypesAction, GetLatestDataFromEnAction } from '@app-core/game-details/actions/game-details.actions';
import { getLoadingState, hasPendingChanges } from '@app-core/game-details/reducers/game-details.reducer';
import { GamePageComponent } from './game-page.component';

describe('Game Details: GamePageComponent', () => {
  let component: GamePageComponent;
  let fixture: ComponentFixture<GamePageComponent>;
  let store$: MockStore<State>;
  const mockedRouter = {
    navigate: jasmine.createSpy('navigate'),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GamePageComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        provideMockStore(),
        FormBuilder,
        { provide: Router, useValue: mockedRouter },
        { provide: ActivatedRoute, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GamePageComponent);
    component = fixture.componentInstance;

    store$ = TestBed.get<Store<State>>(Store);
    store$.overrideSelector(getActiveTab, 'total');
    store$.overrideSelector(getLoadingState, false);
    store$.overrideSelector(hasPendingChanges, false);

    spyOn(store$, 'dispatch');

    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });
});
