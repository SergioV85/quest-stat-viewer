import { createAction, props, union } from '@ngrx/store';
import { CodesListRequest, MonitoringResponse, CodesListResponse, GameRequest } from '@app-common/models';

const cleanMonitoringData = createAction('[Monitoring] Clean monitoring data');
const getMonitoringDetails = createAction(
  '[Monitoring] Request detailed monitoring',
  props<{ teamId?: number; playerId?: number; detailsLevel: string }>(),
);
const getMonitoringDetailsSuccess = createAction(
  '[Monitoring] Detailed monitoring saved to store',
  props<{
    gameId: number;
    detailsLevel: string;
    playerId?: number;
    teamId?: number;
    monitoringData: MonitoringResponse;
  }>(),
);
const getMonitoringDetailsFailed = createAction(
  '[Monitoring] Request detailed game monitoring failed',
  props<{ message?: string }>(),
);
const requestCodes = createAction('[Monitoring] Request list of codes', props<{ query: CodesListRequest }>());
const requestCodesSuccess = createAction(
  '[Monitoring] Codes saved to store',
  props<{
    gameId: number;
    levelId: number;
    playerId?: number;
    teamId?: number;
    requestType: string;
    codes: CodesListResponse;
  }>(),
);
const requestCodesFailed = createAction('[Monitoring] Request list of codes failed', props<{ message?: string }>());
const requestMonitoring = createAction('[Monitoring] Request game monitoring', props<GameRequest>());
const requestMonitoringSuccess = createAction(
  '[Monitoring] Game monitoring saved to store',
  props<{ data: MonitoringResponse | null }>(),
);
const requestMonitoringFailed = createAction(
  '[Monitoring] Request game monitoring failed',
  props<{ message?: string }>(),
);

const actions = {
  cleanMonitoringData,
  getMonitoringDetails,
  getMonitoringDetailsFailed,
  getMonitoringDetailsSuccess,
  requestCodes,
  requestCodesFailed,
  requestCodesSuccess,
  requestMonitoring,
  requestMonitoringFailed,
  requestMonitoringSuccess,
};

const monitoringActions = union(actions);

export type MonitoringActionsType = typeof monitoringActions;

export const MONITORING_ACTIONS = actions;
