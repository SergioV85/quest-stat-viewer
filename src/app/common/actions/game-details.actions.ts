import { Action } from '@ngrx/store';

export enum GameDetailsActionTypes {
  ChangeLevelType = '[Game Details] Change level type',
  ChangeTotalStatTab = '[Game Details] Change tab in total statistic',
  CleanGameData = '[Game Details] Clean game details',
  RemoveLevelFromStat = '[Game Details] Remove level from statistic',
  RequestGameDetails = '[Game Details] Request game data',
  RequestGameDetailsComplete = '[Game Details] Game details saved to store',
  RequestGameDetailsError = '[Game Details] Request game date failed'
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

export type GameDetailsActions
  = ChangeLevelTypeAction
  | ChangeTotalStatTabAction
  | CleanGameDataAction
  | RemoveLevelFromStatAction
  | RequestGameDetailsAction
  | RequestGameDetailsSuccessAction
  | RequestGameDetailsFailedAction;
