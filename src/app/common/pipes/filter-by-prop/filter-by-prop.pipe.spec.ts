import { FilterByPropPipe } from './filter-by-prop.pipe';

describe('FilterByPropPipe', () => {
  const pipe = new FilterByPropPipe();
  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });
  describe('transform', () => {
    it('should return property from object', () => {
      const teamData = {
        id: 95650,
        levelIdx: 40,
        name: 'WDG',
        levelTime: '2019-09-07T22:33:41+02:00',
        additionsTime: 3042000,
        timeout: false,
        duration: 3042000,
        bestTime: false,
      };
      expect(pipe.transform(teamData, 'id')).toEqual(95650);
    });
    it('should return value for nullable value', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(pipe.transform(null as any, 'id')).toEqual(null);
    });
  });
});
