import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { NotificationType } from '@app-common/models';
import { NotificationsService } from '@app-common/services/notification/notification.service';
import { NOTIFICATION_ACTIONS } from '@app-common/actions/notification.actions';

@Injectable()
export class NotificationEffects {
  public errorNotificationMessage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(NOTIFICATION_ACTIONS.successNotification),
        tap(({ message }) => this.notificationService.showNotification(NotificationType.ERROR, { message })),
      ),
    { dispatch: false },
  );

  public warningNotificationMessage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(NOTIFICATION_ACTIONS.warningNotification),
        tap(({ message }) => this.notificationService.showNotification(NotificationType.WARNING, { message })),
      ),
    { dispatch: false },
  );

  public successNotificationMessage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(NOTIFICATION_ACTIONS.successNotification),
        tap(({ message }) => this.notificationService.showNotification(NotificationType.SUCCESS, { message })),
      ),
    { dispatch: false },
  );

  constructor(private readonly actions$: Actions, private readonly notificationService: NotificationsService) {}
}
