import { TotalStatCalculationPipe } from './total-stat-calculation.pipe';

describe('TotalStatCalculationPipe', () => {
  const pipe = new TotalStatCalculationPipe();
  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });
  describe('transform', () => {
    // eslint-disable-next-line no-empty, @typescript-eslint/no-empty-function
    it('should return property from object', () => {});
  });
});
