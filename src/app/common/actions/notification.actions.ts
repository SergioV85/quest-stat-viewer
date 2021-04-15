import { createAction, props, union } from '@ngrx/store';

const errorNotification = createAction('[Notification] Error', props<{ message?: string }>());
const successNotification = createAction('[Notification] Success', props<{ message?: string }>());
const warningNotification = createAction('[Notification] Warning', props<{ message?: string }>());

const actions = {
  errorNotification,
  successNotification,
  warningNotification,
};

const notificationActions = union(actions);

export type NotificationActionsType = typeof notificationActions;

export const NOTIFICATION_ACTIONS = actions;
