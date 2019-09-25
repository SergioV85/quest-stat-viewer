import { createAction, props } from '@ngrx/store';

export const RequestGamesAction = createAction('[Games] Request games');
export const RequestGamesSuccessAction = createAction(
  '[Games] Games saved to store',
  props<{ data: QuestStat.GameInfo[] }>(),
);
export const RequestGamesFailedAction = createAction('[Games] Request games failed', props<{ message: string }>());
