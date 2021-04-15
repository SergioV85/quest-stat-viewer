import { createAction, props, union } from '@ngrx/store';
import { GameRequest, GameData } from '@app-common/models';

const changeLevelType = createAction('[Game Details] Change level type', props<{ levelType: number; level: number }>());
const changeTotalStatTab = createAction('[Game Details] Change tab in total statistic', props<{ tab: number }>());
const cleanGameData = createAction('[Game Details] Clean game details');
const getLatestDataFromEn = createAction('[Game Details] Re-read game data from EN');
const removeLevelFromState = createAction(
  '[Game Details] Remove level from statistic',
  props<{ removed: boolean; level: number }>(),
);
const requestGameDetails = createAction('[Game Details] Request game data', props<GameRequest>());
const requestGameDetailsSuccess = createAction(
  '[Game Details] Game details retrieved from the server',
  props<{ data: GameData | null }>(),
);
const requestGameDetailsFailed = createAction('[Game Details] Request game date failed', props<{ message?: string }>());
const saveLevelsTypes = createAction('[Game Details] Saving levels types to DB');
const saveLevelsTypesSuccess = createAction('[Game Details] Levels types successfully saved to DB');
const saveLevelsTypesFailed = createAction('[Game Details] Unable to save levels types', props<{ message?: string }>());

const actions = {
  changeLevelType,
  changeTotalStatTab,
  cleanGameData,
  getLatestDataFromEn,
  removeLevelFromState,
  requestGameDetails,
  requestGameDetailsFailed,
  requestGameDetailsSuccess,
  saveLevelsTypes,
  saveLevelsTypesSuccess,
  saveLevelsTypesFailed,
};

const gameDetailsActions = union(actions);

export type GameDetailsActionsType = typeof gameDetailsActions;

export const GAME_DETAILS_ACTIONS = actions;
