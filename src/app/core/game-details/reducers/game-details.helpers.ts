import {
  add,
  addIndex,
  adjust,
  append,
  ascend,
  complement,
  contains,
  curry,
  descend,
  dropLast,
  filter,
  find,
  findIndex,
  head,
  isNil,
  length,
  map,
  merge,
  negate,
  nth,
  path,
  pathOr,
  pipe,
  pluck,
  prop,
  propEq,
  propOr,
  sort,
  sortWith,
  subtract,
  sum,
  uniq,
  update,
  reject,
} from 'ramda';
import { TeamData, LevelData, GroupedTeamData, GameDetailsState } from '@app-common/models';

const adjustBonusTime = (isRemoved: boolean, teamStat: TeamData) => {
  if (isNil(teamStat)) {
    return;
  }
  return merge(teamStat, {
    additionsTime: isRemoved
      ? add(pathOr(0, ['additionsTime'], teamStat), teamStat.duration)
      : subtract(pathOr(0, ['additionsTime'], teamStat), teamStat.duration),
  }) as TeamData;
};
const replaceTeamStatInList = (existedLevel: LevelData, updatedStatByTeams: TeamData[], teamStats: TeamData[]) => {
  const teamId = pipe(
    head as (data: TeamData[]) => TeamData,
    prop('id'),
  )(teamStats);
  const indexInList = findIndex(propEq('levelIdx', existedLevel.position))(teamStats);
  if (indexInList < 0) {
    return {
      id: teamId,
      data: teamStats,
    };
  }
  const newStat = find(propEq('id', teamId))(updatedStatByTeams);
  return {
    id: teamId,
    data: update(indexInList, newStat, teamStats),
  };
};

export const appendFinishStat = (finishList: TeamData[], levelsStat: TeamData[][]): TeamData[][] => {
  // tslint:disable-next-line: no-any
  const indexedMap = addIndex(map) as any;
  return indexedMap((levelRow: TeamData[], indx: number) => append(finishList[indx], levelRow), levelsStat);
};
export const appendFinishStatToTeam = (finishList: TeamData[], sortedTeamStat: GroupedTeamData[]): GroupedTeamData[] =>
  map(team => {
    const finishResult = find(propEq('id', team.id), finishList) as TeamData;
    const updatedStat = append(finishResult, team.data);
    return {
      id: team.id,
      data: updatedStat,
    };
  }, sortedTeamStat);
export const getMatchedLevels = (selectedType: number, state: GameDetailsState) =>
  pipe(
    prop('levels') as (data: GameDetailsState) => LevelData[],
    filter(propEq('type', selectedType)) as (data: LevelData[]) => LevelData[],
    filter(complement(prop('removed'))) as (data: LevelData[]) => LevelData[],
    pluck('position') as (data: LevelData[]) => number[],
  )(state);
export const getCalculatedStat = (matchedLevels: number[], team: GroupedTeamData) => ({
  name: pipe(
    prop('data') as (data: GroupedTeamData) => TeamData[],
    head,
    prop('name'),
  )(team) as string,
  id: pipe(
    prop('data') as (data: GroupedTeamData) => TeamData[],
    head,
    prop('id'),
  )(team) as number,
  duration: pipe(
    prop('data') as (data: GroupedTeamData) => TeamData[],
    filter((stat: TeamData) => contains(stat.levelIdx, matchedLevels)) as (data: TeamData[]) => TeamData[],
    pluck('duration'),
    sum,
  )(team),
  closedLevels: pipe(
    prop('data') as (data: GroupedTeamData) => TeamData[],
    length,
  )(team),
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
      find(propEq('id', team.id)),
      prop('closedLevels'),
    )(finishStat);

  const calculateFullTime = (team: TeamData) => subtract(propOr(0, 'duration', team), propOr(0, 'additionsTime', team));

  return sortWith([descend(closedLevels), ascend(calculateFullTime)])(finishStat);
};
export const sortTeamList = (finishList: TeamData[], sortingSource: GroupedTeamData[]): GroupedTeamData[] => {
  const closedLevelQuantity = pipe(
    prop('data') as (data: GroupedTeamData) => TeamData[],
    length,
  );

  const getTeamExtraBonus = (teamSource: TeamData[]): number => {
    const teamId = pipe(
      head,
      prop('id'),
    )(teamSource);

    return pipe(
      find(propEq('id', teamId)),
      pathOr(0, ['extraBonus']),
    )(finishList);
  };

  const calculateFullTime = (teamSource: TeamData[]) =>
    pipe(
      map((team: TeamData) =>
        subtract(propOr(0, 'duration', team) as number, propOr(0, 'additionsTime', team) as number),
      ) as (data: TeamData[]) => number[],
      sum as (data: number[]) => number,
      add(negate(curry(getTeamExtraBonus)(teamSource))),
    )(teamSource);

  const sumDurations = pipe(
    prop('data') as (data: { data: TeamData[] }) => TeamData[],
    calculateFullTime,
  );

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
  const levelIdx = findIndex(propEq('level', updatedLevel.level), currentLevels);
  return adjust(levelIdx, (oldLevel: LevelData) => merge(oldLevel, updatedLevel) as LevelData, currentLevels);
};
export const updateStatByLevel = (removedLevel: LevelData, currentStat: TeamData[][]) =>
  map(levelRow => {
    if (removedLevel.position > levelRow.length) {
      return levelRow;
    }
    // tslint:disable-next-line: no-any
    return adjust(removedLevel.position, curry(adjustBonusTime)(removedLevel.removed) as any, levelRow);
  }, currentStat);
export const updateStatByTeams = (removedLevel: LevelData, currentTeamStat: GroupedTeamData[]) => {
  const updatedStatByTeams: TeamData[] = pipe(
    map(
      pipe(
        prop('data') as (data: GroupedTeamData) => TeamData[],
        find((teamStat: TeamData) => teamStat.levelIdx === removedLevel.position) as (data: TeamData[]) => TeamData,
        curry(adjustBonusTime)(removedLevel.removed),
      ),
    ) as (data: GroupedTeamData[]) => TeamData[],
    reject(isNil) as (data: TeamData[]) => TeamData[],
  )(currentTeamStat);

  return pipe(
    map(
      pipe(
        prop('data') as (data: GroupedTeamData) => TeamData[],
        curry(replaceTeamStatInList)(removedLevel)(updatedStatByTeams),
      ),
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
      find(propEq('id', teamFinishResult.id)),
      prop('data'),
      find((teamStat: TeamData) => teamStat.levelIdx === removedLevel.position),
      pathOr(0, ['duration']),
    )(dataByTeams);
    const newAdditionalTime = removedLevel.removed
      ? add(existedAdditionsTime, levelTime)
      : subtract(existedAdditionsTime, levelTime);

    return merge(teamFinishResult, {
      additionsTime: newAdditionalTime,
    }) as TeamData;
  }, finishResults);

  return sortFinishResults(updateFinishResults);
};
