import { Action, createAction, props } from '@ngrx/store';

export enum MonitoringActionTypes {
  RequestCodes = '[Monitoring] Request list of codes',
  RequestCodesComplete = '[Monitoring] Codes saved to store',
  RequestCodesError = '[Monitoring] Request list of codes failed',
  RequestMonitoring = '[Monitoring] Request game monitoring',
  RequestMonitoringComplete = '[Monitoring] Game monitoring saved to store',
  RequestMonitoringError = '[Monitoring] Request game monitoring failed',
}
export const CleanMonitoringDataAction = createAction('[Monitoring] Clean monitoring data');
export const GetMonitoringDetailsAction = createAction(
  '[Monitoring] Request detailed monitoring',
  props<{ teamId?: number; playerId?: number; detailsLevel?: string }>(),
);
export const GetMonitoringDetailsSuccessAction = createAction(
  '[Monitoring] Detailed monitoring saved to store',
  props<{ detailsLevel: string; playerId?: number; teamId?: number; monitoringData: QuestStat.Monitoring.Response }>(),
);
export const GetMonitoringDetailsFailedAction = createAction(
  '[Monitoring] Request detailed game monitoring failed',
  props<{ message: string }>(),
);
export const RequestCodesAction = createAction(
  '[Monitoring] Request list of codes',
  props<{ query: QuestStat.Monitoring.CodesListRequest }>(),
);
export const RequestCodesSuccessAction = createAction(
  '[Monitoring] Codes saved to store',
  props<{
    levelId: number;
    playerId?: number;
    teamId?: number;
    levelType: string;
    codes: QuestStat.Monitoring.CodesListResponse;
  }>(),
);
export const RequestCodesFailedAction = createAction(
  '[Monitoring] Request list of codes failed',
  props<{ message: string }>(),
);
export const RequestMonitoringAction = createAction(
  '[Monitoring] Request game monitoring',
  props<{ query: QuestStat.GameRequest }>(),
);
export const RequestMonitoringSuccessAction = createAction(
  '[Monitoring] Game monitoring saved to store',
  props<{ data: QuestStat.Monitoring.Response }>(),
);
export const RequestMonitoringFailedAction = createAction(
  '[Monitoring] Request game monitoring failed',
  props<{ message: string }>(),
);
