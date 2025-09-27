import { httpClient } from '../httpClient';
import { API_ENDPOINTS } from '../config/apiConfig';
import { 
  SeasonResponse,
  SeasonsResponse,
  SeasonCreateRequest,
  SeasonUpdateRequest,
  ApiResponse 
} from '../types/apiTypes';
import { Season } from '../../domain/season';

export class SeasonService {
  // Получить список всех сезонов
  async getSeasons(): Promise<ApiResponse<Season[]>> {
    const response = await httpClient.get<SeasonsResponse>(API_ENDPOINTS.SEASONS.LIST);
    
    if (response.data) {
      const seasons = response.data.values.map(seasonResponse => 
        Season.fromResponse(seasonResponse)
      );
      
      return {
        ...response,
        data: seasons
      };
    }
    
    return {
      ...response,
      data: []
    };
  }

  // Получить сезон по ID
  async getSeason(id: number): Promise<ApiResponse<Season>> {
    const response = await httpClient.get<SeasonResponse>(API_ENDPOINTS.SEASONS.GET(id));
    
    if (response.data) {
      const season = Season.fromResponse(response.data);
      
      return {
        ...response,
        data: season
      };
    }
    
    throw new Error('Сезон не найден');
  }

  // Создать новый сезон
  async createSeason(seasonData: SeasonCreateRequest): Promise<ApiResponse<Season>> {
    const response = await httpClient.post<SeasonResponse>(
      API_ENDPOINTS.SEASONS.CREATE,
      seasonData
    );
    
    if (response.data) {
      const season = Season.fromResponse(response.data);
      
      return {
        ...response,
        data: season
      };
    }
    
    throw new Error('Ошибка при создании сезона');
  }

  // Обновить сезон
  async updateSeason(id: number, seasonData: SeasonUpdateRequest): Promise<ApiResponse<Season>> {
    const response = await httpClient.put<SeasonResponse>(
      API_ENDPOINTS.SEASONS.UPDATE(id),
      seasonData
    );
    
    if (response.data) {
      const season = Season.fromResponse(response.data);
      
      return {
        ...response,
        data: season
      };
    }
    
    throw new Error('Ошибка при обновлении сезона');
  }

  // Удалить сезон
  async deleteSeason(id: number): Promise<ApiResponse<void>> {
    return httpClient.delete<void>(API_ENDPOINTS.SEASONS.DELETE(id));
  }
}

// Экспортируем единственный экземпляр сервиса
export const seasonService = new SeasonService();
export default seasonService;
