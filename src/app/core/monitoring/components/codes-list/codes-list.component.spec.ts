import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { State } from '@app-common/models';
import { getCodes } from '@app-core/monitoring/reducers/monitoring.reducer';
import { CodesListComponent } from './codes-list.component';
import { mockedCodesList } from 'app/common/mocks/monitoring.mock';

describe('Monitoring: CodesListComponent', () => {
  let component: CodesListComponent;
  let fixture: ComponentFixture<CodesListComponent>;
  let store$: MockStore<State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CodesListComponent],
      providers: [provideMockStore()],
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
