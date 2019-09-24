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
  drop,
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
  tap,
  uniq,
  update,
  reject,
} from 'ramda';

const adjustBonusTime = (isRemoved: boolean, teamStat: QuestStat.TeamData) => {
  if (isNil(teamStat)) {
    return;
  }
  return merge(teamStat, {
    additionsTime: isRemoved
      ? add(pathOr(0, ['additionsTime'], teamStat), teamStat.duration)
      : subtract(pathOr(0, ['additionsTime'], teamStat), teamStat.duration),
  }) as QuestStat.TeamData;
};
const replaceTeamStatInList = (
  existedLevel: QuestStat.LevelData,
  updatedStatByTeams,
  teamStats: QuestStat.TeamData[],
) => {
  const teamId = pipe(
    head as (data: QuestStat.TeamData[]) => QuestStat.TeamData,
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

export const appendFinishStat = (
  finishList: QuestStat.TeamData[],
  levelsStat: QuestStat.TeamData[][],
): QuestStat.TeamData[][] => {
  const indexedMap = addIndex(map);
  // tslint:disable-next-line: no-any
  return indexedMap((levelRow: QuestStat.TeamData[], indx) => append(finishList[indx], levelRow), levelsStat) as any;
};
export const appendFinishStatToTeam = (
  finishList: QuestStat.TeamData[],
  sortedTeamStat: QuestStat.GroupedTeamData[],
): QuestStat.GroupedTeamData[] => {
  return map(team => {
    const finishResult = find(propEq('id', team.id), finishList);
    const updatedStat = append(finishResult, team.data);
    return {
      id: team.id,
      data: updatedStat,
    };
  }, sortedTeamStat);
};
export const getMatchedLevels = (selectedType: number, state: QuestStat.Store.GameDetails) =>
  pipe(
    prop('levels') as (data: QuestStat.Store.GameDetails) => QuestStat.LevelData[],
    filter(propEq('type', selectedType)) as (data: QuestStat.LevelData[]) => QuestStat.LevelData[],
    filter(complement(prop('removed'))) as (data: QuestStat.LevelData[]) => QuestStat.LevelData[],
    pluck('position') as (data: QuestStat.LevelData[]) => number[],
  )(state);
export const getCalculatedStat = (matchedLevels: number[], team: QuestStat.GroupedTeamData) => ({
  name: pipe(
    prop('data') as (data: QuestStat.GroupedTeamData) => QuestStat.TeamData[],
    nth(0),
    prop('name'),
  )(team),
  id: pipe(
    prop('data') as (data: QuestStat.GroupedTeamData) => QuestStat.TeamData[],
    nth(0),
    prop('id'),
  )(team),
  duration: pipe(
    prop('data') as (data: QuestStat.GroupedTeamData) => QuestStat.TeamData[],
    filter((stat: QuestStat.TeamData) => contains(stat.levelIdx, matchedLevels)) as (
      data: QuestStat.TeamData[],
    ) => QuestStat.TeamData[],
    pluck('duration'),
    sum,
  )(team),
  closedLevels: pipe(
    prop('data') as (data: QuestStat.GroupedTeamData) => QuestStat.TeamData[],
    length,
  )(team),
});
export const getPossibleLevelTypes = pipe(
  dropLast(1) as (data: QuestStat.LevelData[]) => QuestStat.LevelData[],
  pluck('type') as (data: QuestStat.LevelData[]) => number[],
  uniq,
  sort((a: number, b: number) => a - b),
) as (data: QuestStat.LevelData[]) => number[];
export const sortFinishResults = (finishStat: QuestStat.TeamData[]): QuestStat.TeamData[] => {
  const closedLevels = (team: QuestStat.TeamData) =>
    pipe(
      find(propEq('id', team.id)),
      prop('closedLevels'),
    )(finishStat);

  const calculateFullTime = (team: QuestStat.TeamData) =>
    subtract(propOr(0, 'duration', team), propOr(0, 'additionsTime', team));

  return sortWith([descend(closedLevels), ascend(calculateFullTime)])(finishStat);
};
export const sortTeamList = (finishList, sortingSource: QuestStat.GroupedTeamData[]): QuestStat.GroupedTeamData[] => {
  const closedLevelQuantity = pipe(
    prop('data') as (data: QuestStat.GroupedTeamData) => QuestStat.TeamData[],
    length,
  );

  const getTeamExtraBonus = (teamSource): number => {
    const teamId = pipe(
      nth(0) as (data: QuestStat.TeamData[]) => QuestStat.TeamData,
      prop('id'),
    )(teamSource);

    return pipe(
      find(propEq('id', teamId)),
      pathOr(0, ['extraBonus']),
    )(finishList);
  };

  const calculateFullTime = (teamSource: QuestStat.TeamData[]) =>
    pipe(
      map((team: QuestStat.TeamData) =>
        subtract(propOr(0, 'duration', team) as number, propOr(0, 'additionsTime', team) as number),
      ) as (data: QuestStat.TeamData[]) => number[],
      sum as (data: number[]) => number,
      add(negate(curry(getTeamExtraBonus)(teamSource))),
    )(teamSource);

  const sumDurations = pipe(
    prop('data'),
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
  currentLevels: QuestStat.LevelData[],
): QuestStat.LevelData[] => {
  const levelIdx = findIndex(propEq('level', updatedLevel.level), currentLevels);
  return adjust(
    levelIdx,
    (oldLevel: QuestStat.LevelData) => merge(oldLevel, updatedLevel) as QuestStat.LevelData,
    currentLevels,
  );
};
export const updateStatByLevel = (removedLevel: QuestStat.LevelData, currentStat: QuestStat.TeamData[][]) => {
  return map(levelRow => {
    if (removedLevel.position > levelRow.length) {
      return levelRow;
    }
    return adjust(removedLevel.position, curry(adjustBonusTime)(removedLevel.removed), levelRow);
  }, currentStat);
};
export const updateStatByTeams = (removedLevel: QuestStat.LevelData, currentTeamStat: QuestStat.GroupedTeamData[]) => {
  const updatedStatByTeams = pipe(
    map(
      pipe(
        prop('data'),
        find((teamStat: QuestStat.TeamData) => teamStat.levelIdx === removedLevel.position),
        curry(adjustBonusTime)(removedLevel.removed),
      ),
    ),
    reject(isNil),
  )(currentTeamStat);

  return pipe(
    map(
      pipe(
        prop('data') as (data: QuestStat.GroupedTeamData) => QuestStat.TeamData[],
        curry(replaceTeamStatInList)(removedLevel)(updatedStatByTeams),
      ),
    ),
    filter(complement(isNil)),
  )(currentTeamStat) as QuestStat.GroupedTeamData[];
};
export const updateFinishStat = (removedLevel, dataByTeams, finishResults) => {
  const updateFinishResults = map((teamFinishResult: QuestStat.TeamData) => {
    const existedAdditionsTime: number = propOr(0, 'additionsTime', teamFinishResult);
    const levelTime = pipe(
      find(propEq('id', teamFinishResult.id)),
      prop('data'),
      find((teamStat: QuestStat.TeamData) => teamStat.levelIdx === removedLevel.position),
      pathOr(0, ['duration']),
    )(dataByTeams);
    const newAdditionalTime = removedLevel.removed
      ? add(existedAdditionsTime, levelTime)
      : subtract(existedAdditionsTime, levelTime);

    return merge(teamFinishResult, {
      additionsTime: newAdditionalTime,
    }) as QuestStat.TeamData;
  }, finishResults);

  return sortFinishResults(updateFinishResults);
};
