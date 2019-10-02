import { MultiplyNumberPipe } from './multiply-number.pipe';

describe('MultiplyNumberPipe', () => {
  const pipe = new MultiplyNumberPipe();
  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });
  describe('transform', () => {
    it('should return multiplied value', () => {
      expect(pipe.transform(4, 6)).toEqual(24);
    });
    it('should return value for nullable value', () => {
      expect(pipe.transform(0, 2)).toEqual(0);
    });
    it('should return value for nullable multiplier', () => {
      expect(pipe.transform(4)).toEqual(4);
    });
  });
});
