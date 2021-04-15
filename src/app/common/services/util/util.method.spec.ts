import { LevelType } from '@app-common/models';
import { getLevelTypeIcon, getLevelTypeName } from './util.metods';

describe('Utils', () => {
  describe('getLevelTypeIcon', () => {
    it('should return the icon for Search level', () => {
      expect(getLevelTypeIcon(LevelType.Search)).toEqual('fas fa-search');
    });
    it('should return the icon for Logic level', () => {
      expect(getLevelTypeIcon(LevelType.Logic)).toEqual('far fa-lightbulb');
    });
    it('should return the icon for Drive level', () => {
      expect(getLevelTypeIcon(LevelType.Drive)).toEqual('fas fa-car');
    });
    it('should return the icon for Agent level', () => {
      expect(getLevelTypeIcon(LevelType.Agent)).toEqual('far fa-user');
    });
    it('should return the icon for Waiting level', () => {
      expect(getLevelTypeIcon(LevelType.Waiting)).toEqual('far fa-clock');
    });
    it('should return the icon for Combined level', () => {
      expect(getLevelTypeIcon(LevelType.Combined)).toEqual('fas fa-map-pin');
    });
    it('should return the icon for Run level', () => {
      expect(getLevelTypeIcon(LevelType.Run)).toEqual('fas fa-walking');
    });
    it('should return the icon for Rally level', () => {
      expect(getLevelTypeIcon(LevelType.Rally)).toEqual('fas fa-road');
    });
    it('should return the icon for LogicalSearch level', () => {
      expect(getLevelTypeIcon(LevelType.LogicalSearch)).toEqual('fas fa-user-graduate');
    });
    it('should return the icon for Rockets level', () => {
      expect(getLevelTypeIcon(LevelType.Rockets)).toEqual('fas fa-rocket');
    });
    it('should return the icon for General level', () => {
      expect(getLevelTypeIcon(LevelType.General)).toEqual('fas fa-question');
    });
    it('should return the icon for unknown level', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(getLevelTypeIcon(null as any)).toEqual('fas fa-question');
    });
  });
  describe('getLevelTypeName', () => {
    it('should return the icon for Search level', () => {
      expect(getLevelTypeName(LevelType.Search)).toEqual('Поиск');
    });
    it('should return the icon for Logic level', () => {
      expect(getLevelTypeName(LevelType.Logic)).toEqual('Логика');
    });
    it('should return the icon for Drive level', () => {
      expect(getLevelTypeName(LevelType.Drive)).toEqual('Доезд');
    });
    it('should return the name for Agent level', () => {
      expect(getLevelTypeName(LevelType.Agent)).toEqual('Агентский');
    });
    it('should return the name for Waiting level', () => {
      expect(getLevelTypeName(LevelType.Waiting)).toEqual('Заглушка');
    });
    it('should return the name for Combined level', () => {
      expect(getLevelTypeName(LevelType.Combined)).toEqual('Точка');
    });
    it('should return the name for Run level', () => {
      expect(getLevelTypeName(LevelType.Run)).toEqual('Добег');
    });
    it('should return the name for Rally level', () => {
      expect(getLevelTypeName(LevelType.Rally)).toEqual('Ралийка');
    });
    it('should return the name for LogicalSearch level', () => {
      expect(getLevelTypeName(LevelType.LogicalSearch)).toEqual('Лог.Поиск');
    });
    it('should return the name for Rockets level', () => {
      expect(getLevelTypeName(LevelType.Rockets)).toEqual('Ракеты');
    });
    it('should return the name for General level', () => {
      expect(getLevelTypeName(LevelType.General)).toEqual('Неопределен');
    });
    it('should return the name for unknown level', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(getLevelTypeName(null as any)).toEqual('Неопределен');
    });
  });
});
