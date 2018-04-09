import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringByTeamComponent } from './monitoring-by-team.component';

describe('MonitoringByTeamComponent', () => {
  let component: MonitoringByTeamComponent;
  let fixture: ComponentFixture<MonitoringByTeamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitoringByTeamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoringByTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
