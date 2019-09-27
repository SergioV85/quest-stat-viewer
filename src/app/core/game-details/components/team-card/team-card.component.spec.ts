import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockedFormatDurationPipe } from '@app-common/pipes/duration-transform/duration-transform.pip.mock';
import { MockedFormatDateTimePipe } from '@app-common/pipes/date-format/date-format.pipe.mock';
import { TeamCardComponent } from './team-card.component';

describe('Game Details: TeamCardComponent', () => {
  let component: TeamCardComponent;
  let fixture: ComponentFixture<TeamCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TeamCardComponent, MockedFormatDurationPipe, MockedFormatDateTimePipe],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TeamCardComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
