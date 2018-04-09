import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringAccordionComponent } from './monitoring-accordion.component';

describe('MonitoringAccordionComponent', () => {
  let component: MonitoringAccordionComponent;
  let fixture: ComponentFixture<MonitoringAccordionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitoringAccordionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoringAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
