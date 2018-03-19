import { Action } from '@ngrx/store';

export enum NotificationActionTypes {
  SuccessNotification = '[Notification] Success',
  WarningNotification = '[Notification] Warning',
  ErrorNotification = '[Notification] Error',
}

export class SuccessNotificationAction implements Action {
  public readonly type = NotificationActionTypes.SuccessNotification;
  constructor(public payload: { message?: string }) {}
}

export class WarningNotificationAction implements Action {
  public readonly type = NotificationActionTypes.WarningNotification;
  constructor(public payload: { message?: string }) {}
}

export class ErrorNotificationAction implements Action {
  public readonly type = NotificationActionTypes.ErrorNotification;
  constructor(public payload: { message?: string }) {}
}

export type NotificationActions
  = SuccessNotificationAction
  | WarningNotificationAction
  | ErrorNotificationAction;
