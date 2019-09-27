export interface CodeEntry {
  GameId: number;
  code: string | number;
  isRemovedLevel: boolean;
  isSuccess: boolean;
  isTimeout: boolean;
  isDuplicate: boolean;
  level: number;
  teamId: number;
  teamName: string;
  time: string;
  timeDiff: number | null;
  userId: number;
  userName: string;
  _id: string;
}
interface GroupData {
  codesCounts: number;
  correctCodesPercent: number;
  correctCodesQuantity: number;
}
export interface MonitoringLevelData extends GroupData {
  _id: {
    level: number;
    teamId: number;
  };
}
export interface MonitoringTeamGroupedData extends GroupData {
  _id: {
    teamId: number;
    teamName: string;
  };
}
export interface MonitoringTeamDetailedData {
  parsed: boolean;
  dataByLevel?: MonitoringLevelData[];
  dataByUser?: PlayerGroupedData[];
}
export interface PlayerGroupedData extends GroupData {
  _id: {
    userId: number;
    userName: string;
  };
}
export interface PlayerLevelData extends GroupData {
  _id: {
    level: number;
    userId: number;
  };
}
export interface DetailedMonitoring {
  gameId: number;
  playerId?: number;
  teamId?: number;
  detailsLevel: string;
}
export interface MonitoringResponse {
  GameId?: number;
  pageSaved?: number;
  parsed: boolean;
  totalPages?: number;
  _id?: number;
  totalData?: MonitoringTeamGroupedData[] | PlayerLevelData[];
  dataByLevel?: MonitoringLevelData[];
  dataByUser?: PlayerGroupedData[];
}
export interface CodesListRequest {
  gameId?: number;
  playerId?: number;
  teamId?: number;
  levelId: number;
  requestType: string;
}
export type CodesListResponse = CodeEntry[];
