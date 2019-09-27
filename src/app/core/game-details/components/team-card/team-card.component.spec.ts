import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeamCardComponent } from './team-card.component';

describe('Game Details: TeamCardComponent', () => {
  let component: TeamCardComponent;
  let fixture: ComponentFixture<TeamCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TeamCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TeamCardComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
