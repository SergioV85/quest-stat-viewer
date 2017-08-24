declare namespace QuestStat {
  interface GroupedTeamData {
    id: number;
    data: TeamData[];
  }

  interface LevelData {
    level: number;
    name: string;
    removed: boolean;
    type?: string;
  }

  interface TeamData {
    bestTime: boolean;
    duration: number;
    id: number;
    levelIdx: number;
    levelTime: string;
    name: string;
    additionsTime?: {
      bonus?: number;
      penalty?: number;
    }
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
    id: number;
    domain: string;
  }

  interface ViewSettings {
    showLeaderGap?: boolean,
    showBestTime?: boolean
  }
}
