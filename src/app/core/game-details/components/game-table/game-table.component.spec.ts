import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { State } from '@app-common/models';
import { MockedCheckLevelRemovalPipe } from '@app-common/pipes/check-level-removal/check-level-removal.pipe.mock';
import { GetPropertyPipe } from '@app-common/pipes/get-prop/get-prop.pipe';
import { getActiveTab } from '@app-common/reducers/router/router.reducer';
import { GameTableComponent } from './game-table.component';
import { mockedGameDetails } from 'app/common/mocks/games.mock';

describe('Game Details: GameTableComponent', () => {
  let component: GameTableComponent;
  let fixture: ComponentFixture<GameTableComponent>;
  let store$: MockStore<State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GameTableComponent, GetPropertyPipe, MockedCheckLevelRemovalPipe],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        provideMockStore({
          initialState: {
            gameDetails: {
              gameInfo: mockedGameDetails.info,
              levels: mockedGameDetails.stat.Levels,
              dataByTeam: mockedGameDetails.stat.DataByTeam,
              dataByLevels: mockedGameDetails.stat.DataByLevels,
              finishResults: mockedGameDetails.stat.FinishResults,
              isLoading: false,
            },
          },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GameTableComponent);
    component = fixture.componentInstance;

    store$ = TestBed.get<Store<State>>(Store);
    store$.overrideSelector(getActiveTab, 'total');

    spyOn(store$, 'dispatch');

    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });
});
