declare namespace QuestStat {
  interface AdditionTime {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }

  interface LevelData {
    level: number;
    name: string;
    removed: boolean;
    type?: string;
  }

  interface TeamData {
    id: number;
    name: string;
    levelTime: string;
    additionsTime?: {
      bonus?: AdditionTime;
      penalty?: AdditionTime;
    }
  }

  interface GameData {
    levels: LevelData[],
    teamData: TeamData[][],
  }

  interface GameRequest {
    id: number;
    domain: string;
  }
}
