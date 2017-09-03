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
    bestTime: boolean;
    duration: number;
    id: number;
    levelIdx: number;
    levelTime: string;
    name: string;
    additionsTime?: number;
    timeout: boolean;
  }

  interface GameData {
    info: {
      domain: string;
      id: number;
      name: string;
      start: string;
      timezone: string;
    },
    stat: {
      dataByLevels: GroupedTeamData[];
      dataByTeam: GroupedTeamData[];
      finishResults: TeamData[];
      levels: LevelData[];
    };
  }

  interface GameRequest {
    id: number | string;
    domain: string;
  }

  interface ViewSettings {
    showLeaderGap?: boolean,
    showBestTime?: boolean
  }
}
