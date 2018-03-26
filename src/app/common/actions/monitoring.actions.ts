import { Action } from '@ngrx/store';

export enum MonitoringActionTypes {
  RequestMonitoring = '[Monitoring] Request game monitoring',
  RequestMonitoringComplete = '[Monitoring] Game monitoring to store',
  RequestMonitoringError = '[Monitoring] Request game monitoring failed'
}

export class RequestMonitoringAction implements Action {
  readonly type = MonitoringActionTypes.RequestMonitoring;
  constructor(public payload: QuestStat.GameRequest) {}
}
export class RequestMonitoringSuccessAction implements Action {
  readonly type = MonitoringActionTypes.RequestMonitoringComplete;
  constructor(public payload: QuestStat.Monitoring.Response) {}
}
export class RequestMonitoringFailedAction implements Action {
  readonly type = MonitoringActionTypes.RequestMonitoringError;
  constructor(public payload: { message: string }) {}
}

export type MonitoringActions
  = RequestMonitoringAction
  | RequestMonitoringSuccessAction
  | RequestMonitoringFailedAction;
