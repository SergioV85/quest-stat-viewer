import { LevelType } from './level-type.enum';

export class UtilService {
  public static getLevelTypeIcon(type: number): string {
    let icon = '';
    switch (type) {
      case LevelType.Search:
        icon = 'fa-search';
        break;
      case LevelType.Logic:
        icon = 'fa-lightbulb-o';
        break;
      case LevelType.Drive:
        icon = 'fa-car';
        break;
      case LevelType.Agent:
        icon = 'fa-user';
        break;
      case LevelType.Waiting:
        icon = 'fa-clock-o';
        break;
      case LevelType.General:
      default:
        icon = 'fa-question';
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
      case LevelType.General:
      default:
        name = 'Неопределен';
        break;
    }
    return name;
  }
}
