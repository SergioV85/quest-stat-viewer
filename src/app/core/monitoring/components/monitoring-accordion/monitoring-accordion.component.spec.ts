import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatExpansionModule } from '@angular/material';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringAccordionComponent } from './monitoring-accordion.component';

describe('Monitoring: MonitoringAccordionComponent', () => {
  let component: MonitoringAccordionComponent;
  let fixture: ComponentFixture<MonitoringAccordionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatExpansionModule],
      declarations: [MonitoringAccordionComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MonitoringAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
