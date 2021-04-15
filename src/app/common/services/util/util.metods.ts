import { isNil } from 'ramda';
import { LevelType } from '@app-common/models';

export const getLevelTypeIcon = (type: number): string => {
  let icon = '';
  switch (type) {
    case LevelType.Search:
      icon = 'fas fa-search';
      break;
    case LevelType.Logic:
      icon = 'far fa-lightbulb';
      break;
    case LevelType.Drive:
      icon = 'fas fa-car';
      break;
    case LevelType.Agent:
      icon = 'far fa-user';
      break;
    case LevelType.Waiting:
      icon = 'far fa-clock';
      break;
    case LevelType.Combined:
      icon = 'fas fa-map-pin';
      break;
    case LevelType.Run:
      icon = 'fas fa-walking';
      break;
    case LevelType.Rally:
      icon = 'fas fa-road';
      break;
    case LevelType.LogicalSearch:
      icon = 'fas fa-user-graduate';
      break;
    case LevelType.Rockets:
      icon = 'fas fa-rocket';
      break;
    case LevelType.General:
    default:
      icon = 'fas fa-question';
      break;
  }
  return icon;
};

export const getLevelTypeName = (type: number): string => {
  let name = '';
  switch (type) {
    case LevelType.Search:
      name = 'Поиск';
      break;
    case LevelType.Logic:
      name = 'Логика';
      break;
    case LevelType.Drive:
      name = 'Доезд';
      break;
    case LevelType.Agent:
      name = 'Агентский';
      break;
    case LevelType.Waiting:
      name = 'Заглушка';
      break;
    case LevelType.Combined:
      name = 'Точка';
      break;
    case LevelType.Run:
      name = 'Добег';
      break;
    case LevelType.Rally:
      name = 'Ралийка';
      break;
    case LevelType.LogicalSearch:
      name = 'Лог.Поиск';
      break;
    case LevelType.Rockets:
      name = 'Ракеты';
      break;
    case LevelType.General:
    default:
      name = 'Неопределен';
      break;
  }
  return name;
};

export const isNotNullOrUndefined = <T>(input: null | undefined | T): input is T => !isNil(input);
