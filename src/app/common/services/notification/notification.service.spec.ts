import { TestBed, inject } from '@angular/core/testing';

import { NotificationsService } from './notification.service';

describe('NotificationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotificationsService],
    });
  });

  it('should be created', inject([NotificationsService], (service: NotificationsService) => {
    expect(service).toBeTruthy();
  }));
});
