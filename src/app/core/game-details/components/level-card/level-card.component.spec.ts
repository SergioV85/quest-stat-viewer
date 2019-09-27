import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LevelCardComponent } from './level-card.component';
import { SharedComponentsModule } from 'app/common/components/shared-components.module';
import { mockedGameDetails } from 'app/common/mocks/games.mock';

describe('Game Details: LevelCardComponent', () => {
  let component: LevelCardComponent;
  let fixture: ComponentFixture<LevelCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedComponentsModule],
      declarations: [LevelCardComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(LevelCardComponent);
    component = fixture.componentInstance;
    component.levelInfo = mockedGameDetails.stat.Levels[3];

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
