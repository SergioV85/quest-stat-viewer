import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringLoaderComponent } from './monitoring-loader.component';

describe('MonitoringLoaderComponent', () => {
  let component: MonitoringLoaderComponent;
  let fixture: ComponentFixture<MonitoringLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitoringLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoringLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
