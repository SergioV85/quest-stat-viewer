import { createAction, props } from '@ngrx/store';
import { GameInfo } from '@app-common/models';

export const RequestGamesAction = createAction('[Games] Request games');
export const RequestGamesSuccessAction = createAction(
  '[Games] Games saved to store',
  props<{ data: GameInfo[] | null }>(),
);
export const RequestGamesFailedAction = createAction('[Games] Request games failed', props<{ message?: string }>());
