import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { State } from '@app-common/models';
import { FilterByPropPipe } from '@app-common/pipes/filter-by-prop/filter-by-prop.pipe';
import { MockedGetPropertyPipe } from '@app-common/pipes/get-prop/get-prop.pipe mock';
import { getLevels } from '@app-core/game-details/reducers/game-details.reducer';
import { GetMonitoringDetailsAction } from '@app-core/monitoring/actions/monitoring.actions';
import { getTeamData } from '@app-core/monitoring/reducers/monitoring.reducer';
import { MonitoringByTeamComponent } from './monitoring-by-team.component';

describe('Monitoring: MonitoringByTeamComponent', () => {
  let component: MonitoringByTeamComponent;
  let fixture: ComponentFixture<MonitoringByTeamComponent>;
  let store$: MockStore<State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MonitoringByTeamComponent, FilterByPropPipe, MockedGetPropertyPipe],
      providers: [provideMockStore()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    store$ = TestBed.get<Store<State>>(Store);
    store$.overrideSelector(getLevels, []);
    store$.overrideSelector(getTeamData, []);

    fixture = TestBed.createComponent(MonitoringByTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
