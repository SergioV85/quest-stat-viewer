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
      code: string;
      isRemovedLevel: boolean;
      isSuccess: boolean;
      isTimeout: boolean;
      level: number;
      team: string;
      time: string;
      user: string;
    }
    interface GroupedEntries {
      allEntries: number;
      codes: CodeEntry[];
      correct: number;
      percent: number;
    }
    interface TeamData {
      [key: string]: GroupedEntries[];
    }
    interface TotalStat {
      team: string;
      data: GroupedEntries[];
    }
    interface Response {
      byTeams?: TeamData;
      totalStat?: TeamData;
    }
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
      totalStat?: Monitoring.TotalStat;
      byTeams?: Monitoring.TeamData;
    }

    interface State {
      games: Games;
      gameDetails: GameDetails;
      monitoring: Monitoring
      router: any;
    }
  }
}
