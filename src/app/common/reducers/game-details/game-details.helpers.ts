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
  prop,
  propEq,
  propOr,
  sort,
  sortWith,
  subtract,
  sum,
  tap,
  uniq,
  update
} from 'ramda';

const adjustBonusTime = (isRemoved, teamStat) => {
  if (isNil(teamStat)) {
    return;
  }
  return merge(teamStat, {
    additionsTime: isRemoved
      ? add(pathOr(0, ['additionsTime'], teamStat), teamStat.duration)
      : subtract(pathOr(0, ['additionsTime'], teamStat), teamStat.duration)
  });
};
const replaceTeamStatInList = (existedLevel, updatedStatByTeams, teamStats) => {
  const teamId = prop('id', head(teamStats) as any);
  const indexInList = findIndex(propEq('levelIdx', existedLevel.position))(teamStats);
  if (indexInList < 0) {
    return {
      id: teamId,
      data: teamStats
    };
  }
  const newStat = find(propEq('id', teamId))(updatedStatByTeams);
  return {
    id: teamId,
    data: update(indexInList, newStat, teamStats)
  };
};

export const appendFinishStat = (finishList: QuestStat.TeamData[], levelsStat: QuestStat.TeamData[][]): QuestStat.TeamData[][] => {
  const indexedMap = addIndex(map);
  return indexedMap((levelRow, indx) => append(finishList[indx], levelRow), levelsStat);
};
export const appendFinishStatToTeam = (finishList: QuestStat.TeamData[], sortedTeamStat: QuestStat.GroupedTeamData[]):
    QuestStat.GroupedTeamData[] => {
  return map((team) => {
    const finishResult = find(propEq('id', team.id), finishList);
    const updatedStat = append(finishResult, team.data);
    return {
      id: team.id,
      data: updatedStat
    };
  }, sortedTeamStat);
};
export const getMatchedLevels = (selectedType, state) => pipe(
  prop('levels'),
  filter(propEq('type', selectedType)),
  filter(complement(prop('removed'))),
  map(prop('position'))
)(state);
export const getCalculatedStat = (matchedLevels, team) => ({
  name: pipe(
    prop('data'),
    nth(0),
    prop('name')
  )(team) as string,
  id: pipe(
    prop('data'),
    nth(0),
    prop('id')
  )(team) as number,
  duration: pipe(
    prop('data'),
    filter((stat: QuestStat.TeamData) => contains(stat.levelIdx, matchedLevels)) as any,
    map(prop('duration')) as any,
    sum
  )(team) as number,
  closedLevels: pipe(
    prop('data'),
    length
  )(team)
});
export const getPossibleLevelTypes = pipe(
  dropLast(1) as any,
  map(prop('type')),
  uniq,
  sort((a: number, b: number) => a - b) as any
);
export const sortFinishResults = (finishStat: QuestStat.TeamData[]): QuestStat.TeamData[] => {
  const closedLevels = (team: QuestStat.TeamData) => pipe(
    find(propEq('id', team.id)),
    prop('closedLevels')
  )(finishStat);

  const calculateFullTime = (team: QuestStat.TeamData) => subtract(
    propOr(0, 'duration', team),
    propOr(0, 'additionsTime', team)
  );

  return sortWith([
    descend(closedLevels),
    ascend(calculateFullTime)
  ])(finishStat);
};
export const sortTeamList = (finishList, sortingSource: QuestStat.GroupedTeamData[]): QuestStat.GroupedTeamData[] => {
  const closedLevelQuantity = pipe(
    prop('data'),
    length
  );

  const getTeamExtraBonus = (teamSource): number => {
    const teamId = pipe(
      nth(0),
      prop('id')
    )(teamSource);

    return pipe(
      find(propEq('id', teamId)),
      pathOr(0, ['extraBonus'])
    )(finishList) as number;
  };

  const calculateFullTime = (teamSource: QuestStat.TeamData[]) =>
    pipe(
      map((team: QuestStat.TeamData) => subtract(propOr(0, 'duration', team), propOr(0, 'additionsTime', team))),
      sum,
      add(negate(curry(getTeamExtraBonus)((teamSource)) as any))
    )(teamSource);

  const sumDurations = pipe(
    prop('data'),
    calculateFullTime
  );

  return sortWith([
    descend(closedLevelQuantity),
    ascend(sumDurations)
  ])(sortingSource) as QuestStat.GroupedTeamData[];
};
export const updateLevels = (updatedLevel, currentLevels: QuestStat.LevelData[]): QuestStat.LevelData[] => {
  const levelIdx = findIndex(propEq('level', updatedLevel.level), currentLevels);
  return adjust((oldLevel) => merge(oldLevel, updatedLevel), levelIdx, currentLevels);
};
export const updateStatByLevel = (removedLevel, currentStat) => {
  return map((levelRow) => {
    if (removedLevel.position > levelRow.length) {
      return levelRow;
    }
    return adjust(curry(adjustBonusTime)(removedLevel.removed), removedLevel.position, levelRow);
  }, currentStat);
};
export const updateStatByTeams = (removedLevel, currentTeamStat) => {
  const updatedStatByTeams = pipe(
    map(
      pipe(
        prop('data'),
        find((teamStat: QuestStat.TeamData) => teamStat.levelIdx === removedLevel.position),
        curry(adjustBonusTime)(removedLevel.removed),
      )
    ),
    filter(complement(isNil))
  )(currentTeamStat) as QuestStat.GroupedTeamData[];

  return pipe(
    map(
      pipe(
        prop('data'),
        curry(replaceTeamStatInList)(removedLevel)(updatedStatByTeams)
      )
    ),
    filter(complement(isNil))
  )(currentTeamStat) as QuestStat.GroupedTeamData[];
};
export const updateFinishStat = (removedLevel, dataByTeams, finishResults) => {
  const updateFinishResults = map((teamFinishResult: QuestStat.TeamData) => {
    const existedAdditionsTime = propOr(0, 'additionsTime', teamFinishResult) as number;
    const levelTime = pipe(
      find(propEq('id', teamFinishResult.id)),
      prop('data'),
      find((teamStat: QuestStat.TeamData) => teamStat.levelIdx === removedLevel.position),
      pathOr(0, ['duration'])
    )(dataByTeams);
    const newAdditionalTime = removedLevel.removed
      ? add(existedAdditionsTime, levelTime)
      : subtract(existedAdditionsTime, levelTime);

    return merge(teamFinishResult, {
      additionsTime: newAdditionalTime
    });
  }, finishResults) as QuestStat.TeamData[];

  return sortFinishResults(updateFinishResults);
};
