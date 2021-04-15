import { mockedGameDetails } from '@app-common/mocks/games.mock';
import { CheckLevelRemovalPipe } from './check-level-removal.pipe';

describe('CheckLevelRemovalPipe', () => {
  const pipe = new CheckLevelRemovalPipe();
  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });
  describe('transform', () => {
    it('should return true if level is removed', () => {
      const teamData = {
        additionsTime: 705000,
        bestTime: false,
        duration: 705000,
        id: 13977,
        levelIdx: 4,
        levelTime: '2017-12-01T19:57:21+01:00',
        name: 'Закон Ома',
        timeout: false,
      };
      expect(pipe.transform(mockedGameDetails.stat.Levels, teamData)).toEqual(true);
    });
    it('should return false if level not removed', () => {
      const teamData = {
        id: 16858,
        levelIdx: 38,
        name: 'la_Resistance',
        levelTime: '2019-09-07T21:33:49+02:00',
        additionsTime: 338000,
        timeout: false,
        duration: 338000,
        bestTime: false,
      };
      expect(pipe.transform(mockedGameDetails.stat.Levels, teamData)).toEqual(false);
    });
    it('should return false if level data missed', () => {
      const teamData = {
        id: 16858,
        levelIdx: 39,
        name: 'la_Resistance',
        levelTime: '2019-09-07T21:33:49+02:00',
        additionsTime: 338000,
        timeout: false,
        duration: 338000,
        bestTime: false,
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(pipe.transform(null as any, teamData)).toEqual(false);
    });
  });
});
