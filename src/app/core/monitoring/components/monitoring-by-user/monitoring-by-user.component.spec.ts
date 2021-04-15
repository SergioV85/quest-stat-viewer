import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { State } from '@app-common/models';

import { FilterByPropPipe } from '@app-common/pipes/filter-by-prop/filter-by-prop.pipe';
import { MockedGetPropertyPipe } from '@app-common/pipes/get-prop/get-prop.pipe.mock';
import { getLevels } from '@app-core/game-details/reducers/game-details.reducer';
import { MONITORING_ACTIONS } from '@app-core/monitoring/actions/monitoring.actions';
import { getPlayerData } from '@app-core/monitoring/reducers/monitoring.reducer';
import { MonitoringByUserComponent } from './monitoring-by-user.component';

describe('Monitoring: MonitoringByUserComponent', () => {
  let component: MonitoringByUserComponent;
  let fixture: ComponentFixture<MonitoringByUserComponent>;
  let store$: MockStore<State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MonitoringByUserComponent, FilterByPropPipe, MockedGetPropertyPipe],
      providers: [provideMockStore()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    store$ = TestBed.inject<Store<State>>(Store) as MockStore<State>;
    store$.overrideSelector(getLevels, []);
    store$.overrideSelector(getPlayerData, []);

    fixture = TestBed.createComponent(MonitoringByUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
