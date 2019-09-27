import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { NotificationType } from '@app-common/models';
import { NotificationsService } from '@app-common/services/notification/notification.service';
import {
  ErrorNotificationAction,
  WarningNotificationAction,
  SuccessNotificationAction,
} from '@app-common/actions/notification.actions';

@Injectable()
export class NotificationEffects {
  constructor(private readonly actions$: Actions, private readonly notificationService: NotificationsService) {}

  @Effect({ dispatch: false })
  public errorNotificationMessage$ = this.actions$.pipe(
    ofType(ErrorNotificationAction),
    tap(error => this.notificationService.showNotification(NotificationType.ERROR, error)),
  );

  @Effect({ dispatch: false })
  public warningNotificationMessage$ = this.actions$.pipe(
    ofType(WarningNotificationAction),
    tap(warning => this.notificationService.showNotification(NotificationType.WARNING, warning)),
  );

  @Effect({ dispatch: false })
  public successNotificationMessage$ = this.actions$.pipe(
    ofType(SuccessNotificationAction),
    tap(success => this.notificationService.showNotification(NotificationType.SUCCESS, success)),
  );
}
