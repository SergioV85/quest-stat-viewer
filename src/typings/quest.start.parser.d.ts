declare namespace QuestStat {
  interface GroupedTeamData {
    id: number;
    data: TeamData[];
  }

  interface LevelData {
    level: number;
    name: string;
    position: number;
    removed: boolean;
    type?: number;
  }

  interface TeamData {
    bestTime?: boolean;
    closedLevels?: number;
    duration: number;
    extraBonus?: number;
    id: number;
    levelIdx: number;
    levelTime: string;
    name: string;
    additionsTime?: number;
    timeout?: boolean;
  }

  interface GameInfo {
    Domain: string;
    GameId: number;
    GameName: string;
    StartTime: string;
    Timezone: string;
  }

  interface GameData {
    info: GameInfo,
    stat: {
      DataByTeam: GroupedTeamData[];
      DataByLevels: TeamData[][];
      FinishResults: TeamData[];
      Levels: LevelData[];
    };
  }

  interface GameRequest {
    id: number | string;
    domain: string;
    force?: boolean;
  }

  interface ViewSettings {
    showLeaderGap?: boolean,
    showBestTime?: boolean
  }

  namespace Monitoring {
    interface CodeEntry {
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
      timeDiff: number;
      userId: number;
      userName: string;
      _id: string;
    }
    interface GroupData {
      codesCounts: number;
      correctCodesPercent: number;
      correctCodesQuantity: number;
    }
    interface LevelData extends GroupData {
      _id: {
        level: number;
        teamId: number;
      }
    }
    interface TeamGroupedData extends GroupData {
      _id: {
        teamId: number;
        teamName: string;
      }
    }
    interface TeamDetailedData {
      parsed: boolean;
      dataByLevel?: LevelData[];
      dataByUser?: PlayerGroupedData[];
    }
    interface PlayerGroupedData extends GroupData {
      _id: {
        userId: number;
        userName: string;
      }
    }
    interface PlayerLevelData extends GroupData {
      _id: {
        level: number;
        userId: number;
      }
    }
    interface DetailedMonitoring {
      gameId: number;
      playerId?: number;
      teamId?: number;
      detailsLevel: string;
    }
    interface Response {
      GameId?: number;
      pageSaved?: number;
      parsed: boolean;
      totalPages?: number;
      _id?: number;
      totalData?: TeamData[] | PlayerLevelData[];
      dataByLevel?: LevelData[];
      dataByUser?: PlayerGroupedData[];
    }
    interface CodesListRequest {
      gameId?: number;
      playerId?: number;
      teamId?: number;
      levelId: number;
      type: string;
    }
    type CodesListResponse = CodeEntry[];
  }

  namespace Store {
    interface Games {
      isLoading?: boolean;
      games?: GameInfo[];
    }

    interface GameDetails {
      isLoading?: boolean;
      gameInfo?: GameInfo;
      levels?: LevelData[];
      dataByTeam?: GroupedTeamData[];
      dataByLevels?: TeamData[][];
      finishResults?: TeamData[];
      selectedTotalTab?: number;
      originalLevels?: LevelData[]
    }

    interface Monitoring {
      isLoading?: boolean;
      dataLoaded: boolean;
      parsed?: boolean;
      pagesLeft?: number;
      parsedPages?: number;
      totalPages?: number;
      totalData?: Monitoring.TeamGroupedData[];
      teamData?: {
        [key: number]: Monitoring.TeamDetailedData;
      };
      playerData?: {
        [key: number]: {
          parsed: boolean;
          totalData?: Monitoring.PlayerLevelData;
        };
      };
      codes?: {
        [key: number]: Monitoring.CodesListResponse
      };
    }

    interface State {
      games: Games;
      gameDetails: GameDetails;
      monitoring: Monitoring
      router: any;
    }
  }
}
