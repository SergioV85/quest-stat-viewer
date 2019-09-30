import { MatSnackBar } from '@angular/material';
import { TestBed } from '@angular/core/testing';

import { NotificationsService } from './notification.service';
import { NotificationType } from 'app/common/models';

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

  describe('showNotification', () => {
    it('should call snackBar service for showing the notification', () => {
      service.showNotification(NotificationType.WARNING, { message: 'Something happened' });
      expect(mockedSnackService.open).toHaveBeenCalledWith('Something happened', 'Скрыть', {
        politeness: 'assertive',
        duration: 2000,
        panelClass: ['snack-warning-message'],
      });
    });
    it('should call snackBar service for showing the notification with default message', () => {
      service.showNotification(NotificationType.ERROR, {});
      expect(mockedSnackService.open).toHaveBeenCalledWith('Error occurred', 'Скрыть', {
        politeness: 'assertive',
        duration: 2000,
        panelClass: ['snack-error-message'],
      });
    });
  });
});
