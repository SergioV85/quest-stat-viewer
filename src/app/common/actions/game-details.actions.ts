import { createAction, props } from '@ngrx/store';

export const ChangeLevelTypeAction = createAction(
  '[Game Details] Change level type',
  props<{ levelType: number; level: number }>(),
);
export const ChangeTotalStatTabAction = createAction(
  '[Game Details] Change tab in total statistic',
  props<{ tabIndex: number }>(),
);
export const CleanGameDataAction = createAction('[Game Details] Clean game details');
export const GetLatestDataFromEnAction = createAction('[Game Details] Re-read game data from EN');
export const RemoveLevelFromStatAction = createAction(
  '[Game Details] Remove level from statistic',
  props<{ removed: boolean; level: number }>(),
);
export const RequestGameDetailsAction = createAction(
  '[Game Details] Request game data',
  props<{ query: QuestStat.GameRequest }>(),
);
export const RequestGameDetailsSuccessAction = createAction(
  '[Game Details] Game details saved to store',
  props<{ data: QuestStat.GameData }>(),
);
export const RequestGameDetailsFailedAction = createAction(
  '[Game Details] Request game date failed',
  props<{ message?: string }>(),
);
export const SaveLevelsTypesAction = createAction('[Game Details] Saving levels types to DB');
export const SaveLevelsTypesSuccessAction = createAction('[Game Details] Levels types successfully saved to DB');
export const SaveLevelsTypesFailedAction = createAction(
  '[Game Details] Unable to save levels types',
  props<{ message?: string }>(),
);
