import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatProgressBarModule } from '@angular/material';
import { MockedFormatDurationPipe } from '@app-common/pipes/duration-transform/duration-transform.pip.mock';
import { GetPropertyPipe } from '@app-common/pipes/get-prop/get-prop.pipe';
import { MockedFormatEndingPipe } from '@app-common/pipes/format-ending/format-ending.pipe.mock';
import { MultiplyNumberPipe } from '@app-common/pipes/multiply-number/multiply-number.pipe';
import { MonitoringLoaderComponent } from './monitoring-loader.component';

describe('Monitoring: MonitoringLoaderComponent', () => {
  let component: MonitoringLoaderComponent;
  let fixture: ComponentFixture<MonitoringLoaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatProgressBarModule],
      declarations: [
        MonitoringLoaderComponent,
        GetPropertyPipe,
        MultiplyNumberPipe,
        MockedFormatEndingPipe,
        MockedFormatDurationPipe,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
    fixture = TestBed.createComponent(MonitoringLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
