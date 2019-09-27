import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { State } from '@app-common/models';

import { getLevels } from '@app-core/game-details/reducers/game-details.reducer';
import { GetMonitoringDetailsAction } from '@app-core/monitoring/actions/monitoring.actions';
import { getPlayerData } from '@app-core/monitoring/reducers/monitoring.reducer';
import { MonitoringByUserComponent } from './monitoring-by-user.component';

describe('MonitoringByUserComponent', () => {
  let component: MonitoringByUserComponent;
  let fixture: ComponentFixture<MonitoringByUserComponent>;
  let store$: MockStore<State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MonitoringByUserComponent],
      providers: [provideMockStore()],
    }).compileComponents();

    store$ = TestBed.get<Store<State>>(Store);
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
