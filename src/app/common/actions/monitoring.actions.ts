import { Action } from '@ngrx/store';

export enum MonitoringActionTypes {
  CleanMonitoringData = '[Monitoring] Clean monitoring data',
  GetMonitoringDetails = '[Monitoring] Request detailed monitoring',
  GetMonitoringDetailsComplete = '[Monitoring] Detailed monitoring saved to store',
  GetMonitoringDetailsError = '[Monitoring] Request detailed game monitoring failed',
  RequestCodes = '[Monitoring] Request list of codes',
  RequestCodesComplete = '[Monitoring] Codes saved to store',
  RequestCodesError = '[Monitoring] Request list of codes failed',
  RequestMonitoring = '[Monitoring] Request game monitoring',
  RequestMonitoringComplete = '[Monitoring] Game monitoring saved to store',
  RequestMonitoringError = '[Monitoring] Request game monitoring failed',
}
export class CleanMonitoringDataAction implements Action {
  public readonly type = MonitoringActionTypes.CleanMonitoringData;
}
export class GetMonitoringDetailsAction implements Action {
  public readonly type = MonitoringActionTypes.GetMonitoringDetails;
  constructor(public payload: Partial<{ teamId: number; playerId: number; detailsLevel: string }>) {}
}
export class GetMonitoringDetailsSuccessAction implements Action {
  public readonly type = MonitoringActionTypes.GetMonitoringDetailsComplete;
  constructor(
    public payload: {
      detailsLevel: string;
      playerId?: number;
      teamId?: number;
      monitoringData: QuestStat.Monitoring.Response;
    },
  ) {}
}
export class GetMonitoringDetailsFailedAction implements Action {
  public readonly type = MonitoringActionTypes.GetMonitoringDetailsError;
  constructor(public payload: { message: string }) {}
}
export class RequestCodesAction implements Action {
  public readonly type = MonitoringActionTypes.RequestCodes;
  constructor(public payload: QuestStat.Monitoring.CodesListRequest) {}
}
export class RequestCodesSuccessAction implements Action {
  public readonly type = MonitoringActionTypes.RequestCodesComplete;
  constructor(
    public payload: {
      levelId: number;
      playerId?: number;
      teamId?: number;
      type: string;
      codes: QuestStat.Monitoring.CodesListResponse;
    },
  ) {}
}
export class RequestCodesFailedAction implements Action {
  public readonly type = MonitoringActionTypes.RequestCodesError;
  constructor(public payload: { message: string }) {}
}
export class RequestMonitoringAction implements Action {
  public readonly type = MonitoringActionTypes.RequestMonitoring;
  constructor(public payload: QuestStat.GameRequest) {}
}
export class RequestMonitoringSuccessAction implements Action {
  public readonly type = MonitoringActionTypes.RequestMonitoringComplete;
  constructor(public payload: QuestStat.Monitoring.Response) {}
}
export class RequestMonitoringFailedAction implements Action {
  public readonly type = MonitoringActionTypes.RequestMonitoringError;
  constructor(public payload: { message: string }) {}
}

export type MonitoringActions =
  | CleanMonitoringDataAction
  | GetMonitoringDetailsAction
  | GetMonitoringDetailsSuccessAction
  | GetMonitoringDetailsFailedAction
  | RequestCodesAction
  | RequestCodesSuccessAction
  | RequestCodesFailedAction
  | RequestMonitoringAction
  | RequestMonitoringSuccessAction
  | RequestMonitoringFailedAction;
