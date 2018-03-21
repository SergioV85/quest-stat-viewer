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
      DataByLevels: GroupedTeamData[];
      DataByTeam: GroupedTeamData[];
      DataByLevelsRow: TeamData[][];
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

  namespace Store {
    interface Games {
      isLoading?: boolean;
      games?: GameInfo[];
    }

    interface GameDetails {
      isLoading?: boolean;
      levels?: LevelData[];
      dataByTeam?: GroupedTeamData[];
      dataByLevels?: TeamData[][];
      finishResults?: TeamData[];
      selectedTotalTab?: number;
      originalData?: GameData
    }

    interface State {
      games: Games;
      gameDetails: GameDetails;
      router: any;
    }
  }
}
