import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MonitoringLoaderComponent } from './monitoring-loader.component';

describe('MonitoringLoaderComponent', () => {
  let component: MonitoringLoaderComponent;
  let fixture: ComponentFixture<MonitoringLoaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MonitoringLoaderComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(MonitoringLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
