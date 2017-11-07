declare namespace QuestStat {
  interface GroupedTeamData {
    id: number;
    data: TeamData[];
  }

  interface LevelData {
    id: number;
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
    domain: string;
    id: number;
    name: string;
    start: string;
    timezone: string;
  }

  interface GameData {
    info: GameInfo,
    stat: {
      dataByLevels: GroupedTeamData[];
      dataByTeam: GroupedTeamData[];
      dataByLevelsRow: TeamData[][];
      finishResults: TeamData[];
      levels: LevelData[];
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
}
