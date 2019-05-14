import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, tap } from 'rxjs/operators';
import { NotificationsService } from '@app-common/services/notification/notification.service';
import {
  NotificationActionTypes,
  ErrorNotificationAction,
  WarningNotificationAction,
  SuccessNotificationAction,
} from '@app-common/actions/notification.actions';

@Injectable()
export class NotificationEffects {
  constructor(private actions$: Actions, private notificationService: NotificationsService) {}

  @Effect({ dispatch: false })
  public errorNotificationMessage$ = this.actions$.pipe(
    ofType(NotificationActionTypes.ErrorNotification),
    map((action: ErrorNotificationAction) => action.payload),
    tap(error => this.notificationService.showNotification('error', error)),
  );

  @Effect({ dispatch: false })
  public warningNotificationMessage$ = this.actions$.pipe(
    ofType(NotificationActionTypes.WarningNotification),
    map((action: WarningNotificationAction) => action.payload),
    tap(warning => this.notificationService.showNotification('warning', warning)),
  );

  @Effect({ dispatch: false })
  public successNotificationMessage$ = this.actions$.pipe(
    ofType(NotificationActionTypes.SuccessNotification),
    map((action: SuccessNotificationAction) => action.payload),
    tap(success => this.notificationService.showNotification('success', success)),
  );
}
