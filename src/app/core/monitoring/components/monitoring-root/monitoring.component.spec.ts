import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { State, MonitoringTeamGroupedData } from '@app-common/models';

import { isDataParsed, getParsingStat, getTotalData } from '@app-core/monitoring/reducers/monitoring.reducer';
import { MonitoringComponent } from './monitoring.component';
import { mockedMonitoringData, mockedMonitoringDetailsData } from 'app/common/mocks/monitoring.mock';

describe('Monitoring: MonitoringComponent', () => {
  let component: MonitoringComponent;
  let fixture: ComponentFixture<MonitoringComponent>;
  let store$: MockStore<State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MonitoringComponent],
      providers: [provideMockStore()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    store$ = TestBed.inject<Store<State>>(Store) as MockStore<State>;
    store$.overrideSelector(isDataParsed, true);
    store$.overrideSelector(getParsingStat, { pagesLeft: 1, pageSaved: 9, totalPages: 10 });
    store$.overrideSelector(getTotalData, mockedMonitoringData.totalData as MonitoringTeamGroupedData[]);

    fixture = TestBed.createComponent(MonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
