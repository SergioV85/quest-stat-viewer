import { LevelType } from './level-type.enum';

export class UtilService {
  public static getLevelTypeIcon(type: number): string {
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
      case LevelType.General:
      default:
        icon = 'fas fa-question';
        break;
    }
    return icon;
  }

  public static getLevelTypeName(type: number): string {
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
      case LevelType.General:
      default:
        name = 'Неопределен';
        break;
    }
    return name;
  }
}
