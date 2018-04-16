import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringByUserComponent } from './monitoring-by-user.component';

describe('MonitoringByUserComponent', () => {
  let component: MonitoringByUserComponent;
  let fixture: ComponentFixture<MonitoringByUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitoringByUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoringByUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
