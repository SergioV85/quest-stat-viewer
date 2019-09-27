import { createAction, props } from '@ngrx/store';
import { CodesListRequest, MonitoringResponse, CodesListResponse, GameRequest } from '@app-common/models';

export const CleanMonitoringDataAction = createAction('[Monitoring] Clean monitoring data');
export const GetMonitoringDetailsAction = createAction(
  '[Monitoring] Request detailed monitoring',
  props<{ teamId?: number; playerId?: number; detailsLevel: string }>(),
);
export const GetMonitoringDetailsSuccessAction = createAction(
  '[Monitoring] Detailed monitoring saved to store',
  props<{ detailsLevel: string; playerId?: number; teamId?: number; monitoringData: MonitoringResponse }>(),
);
export const GetMonitoringDetailsFailedAction = createAction(
  '[Monitoring] Request detailed game monitoring failed',
  props<{ message?: string }>(),
);
export const RequestCodesAction = createAction(
  '[Monitoring] Request list of codes',
  props<{ query: CodesListRequest }>(),
);
export const RequestCodesSuccessAction = createAction(
  '[Monitoring] Codes saved to store',
  props<{
    levelId: number;
    playerId?: number;
    teamId?: number;
    requestType: string;
    codes: CodesListResponse;
  }>(),
);
export const RequestCodesFailedAction = createAction(
  '[Monitoring] Request list of codes failed',
  props<{ message?: string }>(),
);
export const RequestMonitoringAction = createAction('[Monitoring] Request game monitoring', props<GameRequest>());
export const RequestMonitoringSuccessAction = createAction(
  '[Monitoring] Game monitoring saved to store',
  props<{ data: MonitoringResponse | null }>(),
);
export const RequestMonitoringFailedAction = createAction(
  '[Monitoring] Request game monitoring failed',
  props<{ message?: string }>(),
);
