import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringAccordionComponent } from './monitoring-accordion.component';

describe('Monitoring: MonitoringAccordionComponent', () => {
  let component: MonitoringAccordionComponent;
  let fixture: ComponentFixture<MonitoringAccordionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MonitoringAccordionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MonitoringAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
