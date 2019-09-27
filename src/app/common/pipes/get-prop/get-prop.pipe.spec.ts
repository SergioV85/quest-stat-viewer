import { GetPropertyPipe } from './get-prop.pipe';

describe('GetPropertyPipe', () => {
  const pipe = new GetPropertyPipe();
  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });
  describe('transform', () => {
    it('should return unmapped value by path', () => {
      const data = {
        _id: { userName: 'SergioV', userId: 52015 },
        codesCounts: 123,
        correctCodesQuantity: 36,
        correctCodesPercent: 29.268292682926827,
      };
      expect(pipe.transform(data, '_id-userName', false)).toEqual('SergioV');
    });
  });
});
