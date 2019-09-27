import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { State } from '@app-common/models';
import { MockedFormatDurationPipe } from '@app-common/pipes/duration-transform/duration-transform.pip.mock';
import { MockedGetPropertyPipe } from '@app-common/pipes/get-prop/get-prop.pipe mock';
import { MockedTotalStatCalculationPipe } from '@app-common/pipes/total-stat-calculation/total-stat-calculation.pipe.mock';
import {
  getActiveTabOnTotalStatState,
  getAvailableLevelTypes,
  getFinishResults,
  getSortedTeamsTotalResults,
} from '@app-core/game-details/reducers/game-details.reducer';
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
      providers: [provideMockStore()],
    }).compileComponents();

    fixture = TestBed.createComponent(TotalTableComponent);
    component = fixture.componentInstance;

    store$ = TestBed.get<Store<State>>(Store);
    store$.overrideSelector(getActiveTabOnTotalStatState, 1);
    store$.overrideSelector(getAvailableLevelTypes, [1, 2, 3]);
    store$.overrideSelector(getFinishResults, []);
    store$.overrideSelector(getSortedTeamsTotalResults, []);

    spyOn(store$, 'dispatch');

    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });
});
