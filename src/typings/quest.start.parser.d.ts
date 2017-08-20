declare namespace QuestStat {
  interface LevelData {
    level: number;
    name: string;
    removed: boolean;
    type?: string;
  }

  interface TeamData {
    bestTime: boolean,
    duration: number,
    id: number;
    levelIdx: number,
    levelTime: string;
    name: string;
    additionsTime?: {
      bonus?: number;
      penalty?: number;
    }
  }

  interface GameData {
    info: {
      gameStart: string;
      gameTimeZone: string;
    },
    stat: {
      dataByLevels: Array<{
        id: number,
        data: TeamData[]
      }>;
      dataByTeam: Array<{
        id: number,
        data: TeamData[]
      }>;
      dataByFinishTime: TeamData[][]
      levels: LevelData[]
    };
  }

  interface GameRequest {
    id: number;
    domain: string;
  }
}
