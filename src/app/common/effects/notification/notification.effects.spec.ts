import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { hot } from 'jasmine-marbles';

import { NotificationType } from '@app-common/models';
import { NOTIFICATION_ACTIONS } from '@app-common/actions/notification.actions';
import { NotificationsService } from '@app-common/services/notification/notification.service';
import { NotificationEffects } from './notification.effects';

describe('NotificationEffects', () => {
  let actions$: Observable<Actions>;
  let effects: NotificationEffects;
  const notificationService = {
    showNotification: jasmine.createSpy('showNotification'),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NotificationEffects,
        provideMockActions(() => actions$),
        { provide: NotificationsService, useValue: notificationService },
      ],
    });

    effects = TestBed.inject<NotificationEffects>(NotificationEffects);
    actions$ = TestBed.inject<Observable<Actions>>(Actions);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  describe('errorNotificationMessage', () => {
    it('should call notification service with error message', () => {
      const startAction = NOTIFICATION_ACTIONS.errorNotification({ message: 'some error' });
      actions$ = hot('-a', { a: startAction });

      effects.errorNotificationMessage$.subscribe(() => {
        expect(notificationService.showNotification).toHaveBeenCalledWith(NotificationType.ERROR, {
          message: 'some error',
        });
      });
    });
  });
  describe('warningNotificationMessage', () => {
    it('should call notification service with warning message', () => {
      const startAction = NOTIFICATION_ACTIONS.warningNotification({ message: 'some warning' });
      actions$ = hot('-a', { a: startAction });

      effects.warningNotificationMessage$.subscribe(() => {
        expect(notificationService.showNotification).toHaveBeenCalledWith(NotificationType.WARNING, {
          message: 'some warning',
        });
      });
    });
  });
  describe('successNotificationMessage', () => {
    it('should call notification service with success message', () => {
      const startAction = NOTIFICATION_ACTIONS.successNotification({ message: 'some message' });
      actions$ = hot('-a', { a: startAction });

      effects.successNotificationMessage$.subscribe(() => {
        expect(notificationService.showNotification).toHaveBeenCalledWith(NotificationType.SUCCESS, {
          message: 'some message',
        });
      });
    });
  });
});
