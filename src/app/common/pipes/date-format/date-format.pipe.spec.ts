import { FormatDateTimePipe } from './date-format.pipe';

describe('FormatDateTimePipe', () => {
  const pipe = new FormatDateTimePipe();
  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });
  describe('transform', () => {
    it('should return empty string for nullable input', () => {
      expect(pipe.transform('', 'time')).toEqual('');
    });
    it('should transform string date into long format', () => {
      const hours = new Date(`2019-09-26T13:45:00Z`).getHours();
      expect(pipe.transform('2019-09-26T13:45:00Z', 'longer', true)).toEqual(
        `Sep 26, 2019 26 Sep 2019, ${hours}:45:00`,
      );
    });
    it('should transform native date into short format', () => {
      const date = new Date(2019, 8, 19, 14, 50);
      expect(pipe.transform(date, 'short', false)).toEqual('19 Sep 2019');
    });
    it('should transform native date into time', () => {
      const date = new Date(2019, 8, 19, 10, 45);
      const hours = date.getHours();
      expect(pipe.transform(date, 'time', false)).toEqual(`${hours}:45:00`);
    });
    it('should transform string date into default format', () => {
      const hours = new Date('2019-09-26T13:45:00Z').getHours();
      expect(pipe.transform('2019-09-26T13:45:00Z', 'unknown', true)).toEqual(`26 Sep 2019, ${hours}:45:00`);
    });
  });
});
