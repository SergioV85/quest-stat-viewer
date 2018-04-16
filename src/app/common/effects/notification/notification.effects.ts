import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, tap } from 'rxjs/operators';
import { NotificationsService } from '@app-common/services/notification/notification.service';
import * as NotificationActions from '@app-common/actions/notification.actions';

@Injectable()
export class NotificationEffects {

  constructor(private actions$: Actions,
              private notificationService: NotificationsService) {}

  @Effect({ dispatch: false })
  public $errorNotiticationMessage = this.actions$.pipe(
    ofType(NotificationActions.NotificationActionTypes.ErrorNotification),
    map((action: NotificationActions.ErrorNotificationAction ) => action.payload),
    tap((error) =>
      this.notificationService.showNotification('error', error)
    )
  );

  @Effect({ dispatch: false })
  public $warningNotiticationMessage = this.actions$.pipe(
    ofType(NotificationActions.NotificationActionTypes.WarningNotification),
    map((action: NotificationActions.WarningNotificationAction ) => action.payload),
    tap((warning) =>
      this.notificationService.showNotification('warning', warning)
    )
  );

  @Effect({ dispatch: false })
  public $successNotiticationMessage = this.actions$.pipe(
    ofType(NotificationActions.NotificationActionTypes.SuccessNotification),
    map((action: NotificationActions.SuccessNotificationAction ) => action.payload),
    tap((success) =>
      this.notificationService.showNotification('success', success)
    )
  );
}
