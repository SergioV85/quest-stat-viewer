import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatTableModule } from '@angular/material';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { State } from '@app-common/models';
import { mockedCodesList } from '@app-common/mocks/monitoring.mock';
import { getCodes } from '@app-core/monitoring/reducers/monitoring.reducer';
import { CodesListComponent } from './codes-list.component';
import { MockedFormatDateTimePipe } from '@app-common/pipes/date-format/date-format.pipe.mock';
import { MockedFormatDurationPipe } from '@app-common/pipes/duration-transform/duration-transform.pipe.mock';

describe('Monitoring: CodesListComponent', () => {
  let component: CodesListComponent;
  let fixture: ComponentFixture<CodesListComponent>;
  let store$: MockStore<State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatTableModule],
      declarations: [CodesListComponent, MockedFormatDateTimePipe, MockedFormatDurationPipe],
      providers: [provideMockStore()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    store$ = TestBed.get<Store<State>>(Store);
    store$.overrideSelector(getCodes, { [12345]: mockedCodesList });

    fixture = TestBed.createComponent(CodesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
