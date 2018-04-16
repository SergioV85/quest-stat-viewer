import { Action } from '@ngrx/store';

export enum GamesActionTypes {
  RequestGames = '[Games] Request games',
  RequestGamesComplete = '[Games] Games saved to store',
  RequestGamesError = '[Games] Request games failed'
}

export class RequestGamesAction implements Action {
  readonly type = GamesActionTypes.RequestGames;
}
export class RequestGamesSuccessAction implements Action {
  readonly type = GamesActionTypes.RequestGamesComplete;
  constructor(public payload: QuestStat.GameInfo[]) {}
}
export class RequestGamesFailedAction implements Action {
  readonly type = GamesActionTypes.RequestGamesError;
  constructor(public payload: { message: string }) {}
}

export type GamesActions
  = RequestGamesAction
  | RequestGamesSuccessAction
  | RequestGamesFailedAction;
