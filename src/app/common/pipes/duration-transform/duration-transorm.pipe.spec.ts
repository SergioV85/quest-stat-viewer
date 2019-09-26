import { FormatDurationPipe } from './duration-transform.pipe';

describe('FormatDurationPipe', () => {
  const pipe = new FormatDurationPipe();
  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });
  describe('transform', () => {
    it('should return 0 for nullable input', () => {
      expect(pipe.transform(0)).toEqual(0);
    });
    it('should transform milliseconds duration', () => {
      expect(pipe.transform(735)).toEqual('735 мс');
    });
    it('should transform seconds duration', () => {
      expect(pipe.transform(24, 's')).toEqual('24 с');
    });
    it('should transform minutes duration', () => {
      expect(pipe.transform(135, 's')).toEqual('2 м 15 с');
    });
    it('should transform hours duration', () => {
      expect(pipe.transform(5460000, 'ms')).toEqual('1 ч 31 м');
    });
    it('should transform days duration', () => {
      expect(pipe.transform(115460000, 'ms')).toEqual('1 д 8 ч 4 м 20 с');
    });
  });
});
