import {
  add,
  addIndex,
  adjust,
  append,
  ascend,
  complement,
  contains,
  descend,
  dropLast,
  filter,
  find,
  findIndex,
  head,
  isNil,
  length,
  map,
  mergeRight,
  pathOr,
  pipe,
  pluck,
  prop,
  propEq,
  propOr,
  reject,
  sort,
  sortWith,
  subtract,
  sum,
  uniq,
  update,
} from 'ramda';
import { TeamData, LevelData, GroupedTeamData, GameDetailsState, UnaryOperator } from '@app-common/models';

const adjustBonusTime = (isRemoved: boolean, teamStat: TeamData) => {
  if (isNil(teamStat)) {
    return;
  }
  return mergeRight(teamStat, {
    additionsTime: isRemoved
      ? add(pathOr(0, ['additionsTime'], teamStat), teamStat.duration)
      : subtract(pathOr(0, ['additionsTime'], teamStat), teamStat.duration),
  }) as TeamData;
};
const replaceTeamStatInList = (
  existedLevel: LevelData,
  updatedStatByTeams: TeamData[],
  teamStats: TeamData[],
): { id: number; data: TeamData[] } => {
  const teamId = pipe(head as UnaryOperator<TeamData[], TeamData>, prop('id'))(teamStats);
  const indexInList = findIndex(propEq('levelIdx', existedLevel.position) as UnaryOperator<TeamData, boolean>)(
    teamStats,
  );
  if (indexInList < 0) {
    return {
      id: teamId,
      data: teamStats,
    };
  }
  const newStat = find(propEq('id', teamId))(updatedStatByTeams);
  return {
    id: teamId,
    data: update(indexInList, newStat, teamStats) as TeamData[],
  };
};

export const appendFinishStat = (finishList: TeamData[], levelsStat: TeamData[][]): TeamData[][] => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const indexedMap = addIndex(map) as any;
  return indexedMap((levelRow: TeamData[], indx: number) => append(finishList[indx], levelRow), levelsStat);
};
export const appendFinishStatToTeam = (finishList: TeamData[], sortedTeamStat: GroupedTeamData[]): GroupedTeamData[] =>
  map((team) => {
    const finishResult = find(propEq('id', team.id), finishList) as TeamData;
    const updatedStat = append(finishResult, team.data);
    return {
      id: team.id,
      data: updatedStat,
    };
  }, sortedTeamStat);
export const getMatchedLevels = (selectedType: number, state: GameDetailsState) =>
  pipe(
    prop('levels') as UnaryOperator<GameDetailsState, LevelData[]>,
    filter(propEq('type', selectedType)) as UnaryOperator<LevelData[], LevelData[]>,
    filter(complement(prop('removed') as UnaryOperator<LevelData, boolean>)) as UnaryOperator<LevelData[], LevelData[]>,
    pluck('position') as UnaryOperator<LevelData[], number[]>,
  )(state);
export const getCalculatedStat = (matchedLevels: number[], team: GroupedTeamData) => ({
  name: pipe(
    prop('data') as UnaryOperator<GroupedTeamData, TeamData[]>,
    head as UnaryOperator<TeamData[], TeamData>,
    prop('name'),
  )(team),
  id: pipe(
    prop('data') as UnaryOperator<GroupedTeamData, TeamData[]>,
    head as UnaryOperator<TeamData[], TeamData>,
    prop('id'),
  )(team),
  duration: pipe(
    prop('data') as (data: GroupedTeamData) => TeamData[],
    filter((stat: TeamData) => contains(stat.levelIdx, matchedLevels)) as (data: TeamData[]) => TeamData[],
    pluck('duration'),
    sum,
  )(team),
  closedLevels: pipe(prop('data') as (data: GroupedTeamData) => TeamData[], length)(team),
});
export const getPossibleLevelTypes = pipe(
  dropLast(1) as (data: LevelData[]) => LevelData[],
  pluck('type') as (data: LevelData[]) => number[],
  uniq,
  sort((a: number, b: number) => a - b),
) as (data: LevelData[]) => number[];
export const sortFinishResults = (finishStat: TeamData[]): TeamData[] => {
  const closedLevels = (team: TeamData) =>
    pipe(
      find(propEq('id', team.id) as UnaryOperator<TeamData, boolean>) as UnaryOperator<TeamData[], TeamData>,
      prop('closedLevels') as UnaryOperator<TeamData, number>,
    )(finishStat);

  const calculateFullTime = (team: TeamData) => subtract(propOr(0, 'duration', team), propOr(0, 'additionsTime', team));

  return sortWith([descend(closedLevels), ascend(calculateFullTime)])(finishStat);
};
export const sortTeamList = (finishList: TeamData[], sortingSource: GroupedTeamData[]): GroupedTeamData[] => {
  const closedLevelQuantity = pipe(prop('data') as (data: GroupedTeamData) => TeamData[], length);

  const getTeamExtraBonus = (teamSource: TeamData[]): number => {
    const teamId = pipe(head as UnaryOperator<TeamData[], TeamData>, prop('id'))(teamSource);

    return pipe(find(propEq('id', teamId)), pathOr(0, ['extraBonus']))(finishList);
  };

  const calculateFullTime = (teamSource: TeamData[]) =>
    pipe(
      map((team: TeamData) => team.duration - (team.additionsTime || 0)) as UnaryOperator<TeamData[], number[]>,
      sum as UnaryOperator<number[], number>,
      (s: number): number => s - getTeamExtraBonus(teamSource),
    )(teamSource);

  const sumDurations = pipe(prop('data') as (data: { data: TeamData[] }) => TeamData[], calculateFullTime);

  return sortWith([descend(closedLevelQuantity), ascend(sumDurations)])(sortingSource);
};
export const updateLevels = (
  updatedLevel: {
    removed?: boolean;
    type?: number;
    level: number;
  },
  currentLevels: LevelData[],
): LevelData[] => {
  const levelIdx = findIndex(propEq('level', updatedLevel.level) as UnaryOperator<LevelData, boolean>, currentLevels);
  return adjust(levelIdx, (oldLevel: LevelData) => mergeRight(oldLevel, updatedLevel) as LevelData, currentLevels);
};
export const updateStatByLevel = (removedLevel: LevelData, currentStat: TeamData[][]) =>
  map((levelRow) => {
    if (removedLevel.position > levelRow.length) {
      return levelRow;
    }

    return adjust(
      removedLevel.position,
      (data: TeamData): TeamData => adjustBonusTime(removedLevel.removed, data) as TeamData,
      levelRow,
    );
  }, currentStat);
export const updateStatByTeams = (removedLevel: LevelData, currentTeamStat: GroupedTeamData[]) => {
  const updatedStatByTeams: TeamData[] = pipe(
    map(
      pipe(
        prop('data') as UnaryOperator<GroupedTeamData, TeamData[]>,
        find((teamStat: TeamData) => teamStat.levelIdx === removedLevel.position) as UnaryOperator<
          TeamData[],
          TeamData
        >,
        (data: TeamData) => adjustBonusTime(removedLevel.removed, data),
      ),
    ) as UnaryOperator<GroupedTeamData[], TeamData[]>,
    reject(isNil) as UnaryOperator<TeamData[], TeamData[]>,
  )(currentTeamStat);

  return pipe(
    map(
      pipe(prop('data') as UnaryOperator<GroupedTeamData, TeamData[]>, (data: TeamData[]): {
        id: number;
        data: TeamData[];
      } => replaceTeamStatInList(removedLevel, updatedStatByTeams, data)),
    ),
    filter(complement(isNil)),
  )(currentTeamStat) as GroupedTeamData[];
};
export const updateFinishStat = (
  removedLevel: LevelData,
  dataByTeams: GroupedTeamData[],
  finishResults: TeamData[],
) => {
  const updateFinishResults = map((teamFinishResult: TeamData) => {
    const existedAdditionsTime: number = propOr(0, 'additionsTime', teamFinishResult);
    const levelTime = pipe(
      find(propEq('id', teamFinishResult.id) as UnaryOperator<GroupedTeamData, boolean>) as UnaryOperator<
        GroupedTeamData[],
        GroupedTeamData
      >,
      prop('data'),
      find((teamStat: TeamData) => teamStat.levelIdx === removedLevel.position),
      pathOr(0, ['duration']),
    )(dataByTeams);
    const newAdditionalTime = removedLevel.removed
      ? add(existedAdditionsTime, levelTime)
      : subtract(existedAdditionsTime, levelTime);

    return mergeRight(teamFinishResult, {
      additionsTime: newAdditionalTime,
    }) as TeamData;
  }, finishResults);

  return sortFinishResults(updateFinishResults);
};
