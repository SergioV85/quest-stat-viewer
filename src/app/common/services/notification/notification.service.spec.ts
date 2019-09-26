import { TestBed, inject } from '@angular/core/testing';

import { NotificationsService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotificationsService],
    });

    service = TestBed.get<NotificationsService>(NotificationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
