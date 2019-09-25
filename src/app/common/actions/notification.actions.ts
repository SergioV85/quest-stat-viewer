import { createAction, props } from '@ngrx/store';

export const ErrorNotificationAction = createAction('[Notification] Error', props<{ message?: string }>());
export const SuccessNotificationAction = createAction('[Notification] Success', props<{ message?: string }>());
export const WarningNotificationAction = createAction('[Notification] Warning', props<{ message?: string }>());
