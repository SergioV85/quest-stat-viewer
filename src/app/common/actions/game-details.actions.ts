import { Action } from '@ngrx/store';

export enum GameDetailsActionTypes {
  ChangeLevelType = '[Game Details] Change level type',
  ChangeTotalStatTab = '[Game Details] Change tab in total statistic',
  CleanGameData = '[Game Details] Clean game details',
  GetLatestDataFromEn = '[Game Details] Re-read game data from EN',
  RemoveLevelFromStat = '[Game Details] Remove level from statistic',
  RequestGameDetails = '[Game Details] Request game data',
  RequestGameDetailsComplete = '[Game Details] Game details saved to store',
  RequestGameDetailsError = '[Game Details] Request game date failed',
  SaveLevelsTypes = '[Game Details] Saving levels types to DB',
  SaveLevelsTypesComplete = '[Game Details] Levels types successfully saved to DB',
  SaveLevelsTypesError = '[Game Details] Unable to save levels types'
}
export class ChangeLevelTypeAction implements Action {
  readonly type = GameDetailsActionTypes.ChangeLevelType;
  constructor(public payload: { type: number, level: number }) {}
}
export class ChangeTotalStatTabAction implements Action {
  readonly type = GameDetailsActionTypes.ChangeTotalStatTab;
  constructor(public payload: number) {}
}
export class CleanGameDataAction implements Action {
  readonly type = GameDetailsActionTypes.CleanGameData;
}
export class GetLatestDataFromEnAction implements Action {
  readonly type = GameDetailsActionTypes.GetLatestDataFromEn;
}
export class RemoveLevelFromStatAction implements Action {
  readonly type = GameDetailsActionTypes.RemoveLevelFromStat;
  constructor(public payload: { removed: boolean, level: number }) {}
}
export class RequestGameDetailsAction implements Action {
  readonly type = GameDetailsActionTypes.RequestGameDetails;
  constructor(public payload: QuestStat.GameRequest) {}
}
export class RequestGameDetailsSuccessAction implements Action {
  readonly type = GameDetailsActionTypes.RequestGameDetailsComplete;
  constructor(public payload: QuestStat.GameData) {}
}
export class RequestGameDetailsFailedAction implements Action {
  readonly type = GameDetailsActionTypes.RequestGameDetailsError;
  constructor(public payload: { message: string }) {}
}
export class SaveLevelsTypesAction implements Action {
  readonly type = GameDetailsActionTypes.SaveLevelsTypes;
}
export class SaveLevelsTypesSuccessAction implements Action {
  readonly type = GameDetailsActionTypes.SaveLevelsTypesComplete;
}
export class SaveLevelsTypesFailedAction implements Action {
  readonly type = GameDetailsActionTypes.SaveLevelsTypesError;
  constructor(public payload: { message: string }) {}
}

export type GameDetailsActions
  = ChangeLevelTypeAction
  | ChangeTotalStatTabAction
  | CleanGameDataAction
  | GetLatestDataFromEnAction
  | RemoveLevelFromStatAction
  | RequestGameDetailsAction
  | RequestGameDetailsSuccessAction
  | RequestGameDetailsFailedAction
  | SaveLevelsTypesAction
  | SaveLevelsTypesSuccessAction
  | SaveLevelsTypesFailedAction;
