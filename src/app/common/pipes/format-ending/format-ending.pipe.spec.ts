import { FormatEndingPipe } from './format-ending.pipe';

describe('FormatEndingPipe', () => {
  const pipe = new FormatEndingPipe();
  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });
  describe('transform', () => {
    it('should return empty string if number is null ', () => {
      expect(pipe.transform(0, 'игр')).toEqual('');
    });
    describe('pages', () => {
      it('should return singular form for pages', () => {
        expect(pipe.transform(1, 'страниц')).toEqual('страница');
      });
      it('should return plural (up to 5) form for pages', () => {
        expect(pipe.transform(2, 'страниц')).toEqual('страницы');
      });
      it('should return plural (more than 5) form for pages', () => {
        expect(pipe.transform(6, 'страниц')).toEqual('страниц');
      });
    });
    it('should return original word if no endings described', () => {
      expect(pipe.transform(2, 'игр')).toEqual('игр');
    });
  });
});
