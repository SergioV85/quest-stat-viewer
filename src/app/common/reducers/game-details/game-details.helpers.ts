import {
  add,
  addIndex,
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
  uniq
} from 'ramda';

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
  path(['gameData', 'stat', 'Levels']),
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

  const calculateFullTime = (teamSource: QuestStat.TeamData[]) => {
    return pipe(
      map((team: QuestStat.TeamData) => subtract(propOr(0, 'duration', team), propOr(0, 'additionsTime', team))),
      sum,
      add(negate(curry(getTeamExtraBonus)((teamSource)) as any))
    )(teamSource);
  };

  const sumDurations = pipe(
    prop('data'),
    calculateFullTime
  );

  return sortWith([
    descend(closedLevelQuantity),
    ascend(sumDurations)
  ])(sortingSource) as QuestStat.GroupedTeamData[];
};

