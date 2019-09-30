import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { State } from '@app-common/models';
import { mockedGameDetails } from '@app-common/mocks/games.mock';
import { MockedFormatDurationPipe } from '@app-common/pipes/duration-transform/duration-transform.pipe.mock';
import { MockedGetPropertyPipe } from '@app-common/pipes/get-prop/get-prop.pipe.mock';
import { MockedTotalStatCalculationPipe } from '@app-common/pipes/total-stat-calculation/total-stat-calculation.pipe.mock';
import { ChangeTotalStatTabAction } from '@app-core/game-details/actions/game-details.actions';
import { TotalTableComponent } from './total-table.component';

describe('Game Details: TotalTableComponent', () => {
  let component: TotalTableComponent;
  let fixture: ComponentFixture<TotalTableComponent>;
  let store$: MockStore<State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TotalTableComponent,
        MockedGetPropertyPipe,
        MockedFormatDurationPipe,
        MockedTotalStatCalculationPipe,
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        provideMockStore({
          initialState: {
            gameDetails: {
              isLoading: false,
              gameInfo: mockedGameDetails.info,
              levels: mockedGameDetails.stat.Levels,
              dataByTeam: mockedGameDetails.stat.DataByTeam,
              dataByLevels: mockedGameDetails.stat.DataByLevels,
              finishResults: mockedGameDetails.stat.FinishResults,
              selectedTotalTab: 0,
              originalLevels: mockedGameDetails.stat.Levels,
            },
          },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TotalTableComponent);
    component = fixture.componentInstance;

    store$ = TestBed.get<Store<State>>(Store);

    spyOn(store$, 'dispatch');

    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });
  describe('getLevelTypeIcon', () => {
    it('should return the icon for level', () => {
      expect(component.getLevelTypeIcon(0)).toEqual('fas fa-question');
    });
  });
  describe('getLevelTypeName', () => {
    it('should return the name for level', () => {
      expect(component.getLevelTypeName(0)).toEqual('Неопределен');
    });
  });
  describe('getPrevTeamDifferenceClass', () => {
    it('should return the class for difference less than 1 second', () => {
      expect(component.getPrevTeamDifferenceClass(100)).toEqual('total-table__team-prev-difference--lessThanSecond');
    });
    it('should return the class for difference less than 1 minute', () => {
      expect(component.getPrevTeamDifferenceClass(3600)).toEqual('total-table__team-prev-difference--lessThanMinute');
    });
    it('should return the class for difference less than 1 hour', () => {
      expect(component.getPrevTeamDifferenceClass(2000000)).toEqual('total-table__team-prev-difference--lessThanHour');
    });
    it('should return the class for difference bigger than 1 hour', () => {
      expect(component.getPrevTeamDifferenceClass(10000000)).toEqual('total-table__team-prev-difference--moreThanHour');
    });
  });
  describe('changeTab', () => {
    it('should dispatch ChangeTotalStatTabAction with new tab', () => {
      const action = ChangeTotalStatTabAction({ tab: 1 });
      component.changeTab({ tab: { textLabel: '1' } } as MatTabChangeEvent);
      expect(store$.dispatch).toHaveBeenCalledWith(action);
    });
  });
});
