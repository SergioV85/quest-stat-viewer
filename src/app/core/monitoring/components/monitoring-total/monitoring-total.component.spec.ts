import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringTotalComponent } from './monitoring-total.component';

describe('Monitoring: MonitoringTotalComponent', () => {
  let component: MonitoringTotalComponent;
  let fixture: ComponentFixture<MonitoringTotalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MonitoringTotalComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MonitoringTotalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
