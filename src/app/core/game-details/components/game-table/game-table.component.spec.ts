import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { State } from '@app-common/models';
import { getActiveTab } from '@app-common/reducers/router/router.reducer';
import { getLevels, getStatData } from '@app-core/game-details/reducers/game-details.reducer';
import { GameTableComponent } from './game-table.component';

describe('Game Details: GameTableComponent', () => {
  let component: GameTableComponent;
  let fixture: ComponentFixture<GameTableComponent>;
  let store$: MockStore<State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GameTableComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [provideMockStore()],
    }).compileComponents();

    fixture = TestBed.createComponent(GameTableComponent);
    component = fixture.componentInstance;

    store$ = TestBed.get<Store<State>>(Store);
    store$.overrideSelector(getActiveTab, 'total');
    store$.overrideSelector(getLevels, []);
    store$.overrideSelector(getStatData, { teams: [], levels: [] });

    spyOn(store$, 'dispatch');

    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });
});
