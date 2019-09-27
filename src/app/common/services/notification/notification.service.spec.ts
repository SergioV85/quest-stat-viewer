import { MatSnackBar } from '@angular/material';
import { TestBed } from '@angular/core/testing';

import { NotificationsService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationsService;
  const mockedSnackService = {
    open: jasmine.createSpy('open'),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotificationsService, { provide: MatSnackBar, useValue: mockedSnackService }],
    });

    service = TestBed.get<NotificationsService>(NotificationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
