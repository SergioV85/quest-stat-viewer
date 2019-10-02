import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { State } from '@app-common/models';
import { mockedGameDetails } from '@app-common/mocks/games.mock';
import { MockedCheckLevelRemovalPipe } from '@app-common/pipes/check-level-removal/check-level-removal.pipe.mock';
import { GetPropertyPipe } from '@app-common/pipes/get-prop/get-prop.pipe';
import { getActiveTab } from '@app-common/reducers/router/router.reducer';
import { ChangeLevelTypeAction, RemoveLevelFromStatAction } from '@app-core/game-details/actions/game-details.actions';
import { GameTableComponent } from './game-table.component';

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
  describe('getTeamSelectionCssClass', () => {
    it('should return empty string if team is not selected', () => {
      expect(
        component.getTeamSelectionCssClass({
          id: 13977,
          levelIdx: 6,
          name: 'Закон Ома',
          levelTime: '2017-12-01T20:14:40+01:00',
          additionsTime: null,
          timeout: false,
          duration: 135000,
          bestTime: true,
        }),
      ).toEqual('');
    });
    it('should return specific class for selected team', () => {
      component.selectedTeams = [13977];
      expect(
        component.getTeamSelectionCssClass({
          id: 13977,
          levelIdx: 6,
          name: 'Закон Ома',
          levelTime: '2017-12-01T20:14:40+01:00',
          additionsTime: null,
          timeout: false,
          duration: 135000,
          bestTime: true,
        }),
      ).toEqual('gameTable__team--selected gameTable__team--selection-1');
    });
  });
  describe('toggleTeamSelection', () => {
    it('should add team to selection', () => {
      component.toggleTeamSelection({
        id: 13977,
        levelIdx: 6,
        name: 'Закон Ома',
        levelTime: '2017-12-01T20:14:40+01:00',
        additionsTime: null,
        timeout: false,
        duration: 135000,
        bestTime: true,
      });
      expect(component.selectedTeams).toEqual([13977]);
    });
    it('should remove team from selection', () => {
      component.selectedTeams = [140550, 13977];
      component.toggleTeamSelection({
        id: 13977,
        levelIdx: 6,
        name: 'Закон Ома',
        levelTime: '2017-12-01T20:14:40+01:00',
        additionsTime: null,
        timeout: false,
        duration: 135000,
        bestTime: true,
      });
      expect(component.selectedTeams).toEqual([140550]);
    });
  });
  describe('changeLevelType', () => {
    it('should dispatch action ChangeLevelTypeAction', () => {
      const action = ChangeLevelTypeAction({ level: 4, levelType: 4 });
      component.changeLevelType({ type: 4, level: 4 });
      expect(store$.dispatch).toHaveBeenCalledWith(action);
    });
  });
  describe('removeLevel', () => {
    it('should dispatch action RemoveLevelFromStatAction', () => {
      const action = RemoveLevelFromStatAction({ level: 4, removed: true });
      component.removeLevel({ removed: true, level: 4 });
      expect(store$.dispatch).toHaveBeenCalledWith(action);
    });
  });
});
