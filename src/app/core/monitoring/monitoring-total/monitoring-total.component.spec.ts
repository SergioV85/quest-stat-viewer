import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringTotalComponent } from './monitoring-total.component';

describe('MonitoringTotalComponent', () => {
  let component: MonitoringTotalComponent;
  let fixture: ComponentFixture<MonitoringTotalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MonitoringTotalComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoringTotalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
