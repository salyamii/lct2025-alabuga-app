import { SeasonResponse, SeasonCreateRequest, SeasonUpdateRequest } from "../api/types/apiTypes";

export class Season {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly startDate: Date,
    public readonly endDate: Date
  ) {}

  static fromResponse(response: SeasonResponse): Season {
    return new Season(
      response.id,
      response.name,
      new Date(response.startDate),
      new Date(response.endDate)
    );
  }

  static toCreateRequest(season: Omit<Season, 'id'>): SeasonCreateRequest {
    return {
      name: season.name,
      startDate: season.startDate.toISOString(),
      endDate: season.endDate.toISOString()
    };
  }

  static toUpdateRequest(season: Omit<Season, 'id'>): SeasonUpdateRequest {
    return {
      name: season.name,
      startDate: season.startDate.toISOString(),
      endDate: season.endDate.toISOString()
    };
  }

  // Методы для валидации
  static validateDates(startDate: Date, endDate: Date): string[] {
    const errors: string[] = [];
    const now = new Date();
    
    if (startDate < now) {
      errors.push('Дата начала не может быть в прошлом');
    }
    
    if (endDate <= startDate) {
      errors.push('Дата окончания должна быть позже даты начала');
    }
    
    if (startDate.getTime() === endDate.getTime()) {
      errors.push('Даты начала и окончания не могут совпадать');
    }
    
    return errors;
  }

  static validateName(name: string): string[] {
    const errors: string[] = [];
    
    if (!name || name.trim().length === 0) {
      errors.push('Название сезона не может быть пустым');
    }
    
    if (name.length < 3) {
      errors.push('Название сезона должно содержать минимум 3 символа');
    }
    
    if (name.length > 100) {
      errors.push('Название сезона не должно превышать 100 символов');
    }
    
    return errors;
  }
}
