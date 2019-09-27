import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringTotalComponent } from './monitoring-total.component';

describe('Monitoring Module: MonitoringTotalComponent', () => {
  let component: MonitoringTotalComponent;
  let fixture: ComponentFixture<MonitoringTotalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MonitoringTotalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MonitoringTotalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
