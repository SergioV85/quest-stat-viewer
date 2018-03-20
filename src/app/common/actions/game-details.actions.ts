import { Action } from '@ngrx/store';

export enum GameDetailsActionTypes {
  ChangeTotalStatTab = '[Game Details] Change tab in total statistic',
  CleanGameData = '[Game Details] Clean game details',
  RequestGameDetails = '[Game Details] Request game data',
  RequestGameDetailsComplete = '[Game Details] Game details saved to store',
  RequestGameDetailsError = '[Game Details] Request game date failed'
}
export class ChangeTotalStatTabAction implements Action {
  readonly type = GameDetailsActionTypes.ChangeTotalStatTab;
  constructor(public payload: number) {}
}
export class CleanGameDataAction implements Action {
  readonly type = GameDetailsActionTypes.CleanGameData;
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
  = ChangeTotalStatTabAction
  | CleanGameDataAction
  | RequestGameDetailsAction
  | RequestGameDetailsSuccessAction
  | RequestGameDetailsFailedAction;
