import { Action } from '@ngrx/store';

export enum MonitoringActionTypes {
  GetMonitoringDetails = '[Monitoring] Request detailed monitoring',
  GetMonitoringDetailsComplete = '[Monitoring] Detailed monitoring saved to store',
  GetMonitoringDetailsError = '[Monitoring] Request detailed game monitoring failed',
  RequestMonitoring = '[Monitoring] Request game monitoring',
  RequestMonitoringComplete = '[Monitoring] Game monitoring saved to store',
  RequestMonitoringError = '[Monitoring] Request game monitoring failed'
}

export class GetMonitoringDetailsAction implements Action {
  readonly type = MonitoringActionTypes.GetMonitoringDetails;
  constructor(public payload: Partial<{ teamId: number, detailsLevel: string }>) {}
}
export class GetMonitoringDetailsSuccessAction implements Action {
  readonly type = MonitoringActionTypes.GetMonitoringDetailsComplete;
  constructor(public payload: {
    teamId: number,
    monitoringData: QuestStat.Monitoring.Response
  }) {}
}
export class GetMonitoringDetailsFailedAction implements Action {
  readonly type = MonitoringActionTypes.GetMonitoringDetailsError;
  constructor(public payload: { message: string }) {}
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
  = GetMonitoringDetailsAction
  | GetMonitoringDetailsSuccessAction
  | GetMonitoringDetailsFailedAction
  | RequestMonitoringAction
  | RequestMonitoringSuccessAction
  | RequestMonitoringFailedAction;
