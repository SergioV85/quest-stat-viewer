import { RouterReducerState } from '@ngrx/router-store';
import {
  CodesListResponse,
  GameInfo,
  GroupedTeamData,
  LevelData,
  MonitoringTeamDetailedData,
  MonitoringTeamGroupedData,
  PlayerLevelData,
  TeamData,
} from '.';

export interface GamesState {
  isLoading: boolean;
  games?: GameInfo[] | null;
}

export interface GameDetailsState {
  isLoading: boolean;
  gameInfo?: GameInfo;
  levels?: LevelData[];
  dataByTeam?: GroupedTeamData[];
  dataByLevels?: TeamData[][];
  finishResults?: TeamData[];
  selectedTotalTab?: number;
  originalLevels?: LevelData[];
}

export interface MonitoringState {
  isLoading?: boolean;
  dataLoaded: boolean;
  parsed?: boolean;
  pagesLeft?: number;
  parsedPages?: number;
  totalPages?: number;
  totalData?: MonitoringTeamGroupedData[];
  teamData?: {
    [key: number]: MonitoringTeamDetailedData;
  };
  playerData?: {
    [key: number]: {
      parsed: boolean;
      totalData?: PlayerLevelData;
    };
  };
  codes?: {
    [key: number]: CodesListResponse;
  };
}

export interface State {
  games?: GamesState;
  gameDetails?: GameDetailsState;
  monitoring?: MonitoringState;
  router: RouterReducerState;
}
