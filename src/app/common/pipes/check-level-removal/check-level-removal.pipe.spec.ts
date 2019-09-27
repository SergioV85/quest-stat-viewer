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
        id: 95650,
        levelIdx: 40,
        name: 'WDG',
        levelTime: '2019-09-07T22:33:41+02:00',
        additionsTime: 3042000,
        timeout: false,
        duration: 3042000,
        bestTime: false,
      };
      expect(pipe.transform(mockedGameDetails.stat.Levels, teamData)).toEqual(true);
    });
    it('should return false if level not removed', () => {
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
      // tslint:disable-next-line: no-any
      expect(pipe.transform(null as any, teamData)).toEqual(false);
    });
  });
});
