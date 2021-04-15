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

    spyOn(component.levelTypeChange, 'emit');
    spyOn(component.levelStateChange, 'emit');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('selectLevelType', () => {
    it('should emit event with new level type', () => {
      component.selectLevelType(4);
      expect(component.levelTypeChange.emit).toHaveBeenCalledWith(4);
    });
  });
  describe('toggleLevelState', () => {
    it('should emit event with new level state', () => {
      component.toggleLevelState();
      expect(component.levelStateChange.emit).toHaveBeenCalledWith(true);
    });
    it('should emit not event if level data is nullable', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      component.levelData = null as any;
      component.toggleLevelState();
      expect(component.levelStateChange.emit).not.toHaveBeenCalledWith(true);
    });
  });
});
