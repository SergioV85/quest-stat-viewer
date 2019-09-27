import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { State } from '@app-common/models';

import { isDataParsed } from '@app-core/monitoring/reducers/monitoring.reducer';
import { MonitoringComponent } from './monitoring.component';

describe('Monitoring Module: MonitoringComponent', () => {
  let component: MonitoringComponent;
  let fixture: ComponentFixture<MonitoringComponent>;
  let store$: MockStore<State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MonitoringComponent],
      providers: [provideMockStore()],
    }).compileComponents();

    store$ = TestBed.get<Store<State>>(Store);
    store$.overrideSelector(isDataParsed, true);

    fixture = TestBed.createComponent(MonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
