import { httpClient } from '../httpClient';
import { API_ENDPOINTS } from '../config/apiConfig';
import { 
  RankResponse,
  RanksResponse,
  RankCreateRequest,
  RankUpdateRequest,
  AddRequiredCompetencyToRankRequest,
  ApiResponse 
} from '../types/apiTypes';
import { Rank } from '../../domain/rank';

export class RankService {
  // Получить список всех рангов
  async getRanks(): Promise<ApiResponse<Rank[]>> {
    const response = await httpClient.get<RanksResponse>(API_ENDPOINTS.RANKS.LIST);
    
    if (response.data) {
      const ranks = response.data.values.map(rankResponse => 
        Rank.fromResponse(rankResponse)
      );
      
      return {
        ...response,
        data: ranks
      };
    }
    
    return {
      ...response,
      data: []
    };
  }

  // Получить ранг по ID
  async getRank(id: number): Promise<ApiResponse<Rank>> {
    const response = await httpClient.get<RankResponse>(API_ENDPOINTS.RANKS.GET(id));
    
    if (response.data) {
      const rank = Rank.fromResponse(response.data);
      
      return {
        ...response,
        data: rank
      };
    }
    
    throw new Error('Ранг не найден');
  }

  // Создать новый ранг
  async createRank(rankData: RankCreateRequest): Promise<ApiResponse<Rank>> {
    const response = await httpClient.post<RankResponse>(
      API_ENDPOINTS.RANKS.CREATE,
      rankData
    );
    
    if (response.data) {
      const rank = Rank.fromResponse(response.data);
      
      return {
        ...response,
        data: rank
      };
    }
    
    throw new Error('Ошибка при создании ранга');
  }

  // Обновить ранг
  async updateRank(id: number, rankData: RankUpdateRequest): Promise<ApiResponse<Rank>> {
    const response = await httpClient.put<RankResponse>(
      API_ENDPOINTS.RANKS.UPDATE(id),
      rankData
    );
    
    if (response.data) {
      const rank = Rank.fromResponse(response.data);
      
      return {
        ...response,
        data: rank
      };
    }
    
    throw new Error('Ошибка при обновлении ранга');
  }

  // Удалить ранг
  async deleteRank(id: number): Promise<ApiResponse<void>> {
    return httpClient.delete<void>(API_ENDPOINTS.RANKS.DELETE(id));
  }

  // Добавить обязательную миссию к рангу
  async addRequiredMissionToRank(rankId: number, missionId: number): Promise<ApiResponse<Rank>> {
    const response = await httpClient.post<RankResponse>(
      API_ENDPOINTS.RANKS.ADD_REQUIRED_MISSION(rankId, missionId)
    );
    
    if (response.data) {
      const rank = Rank.fromResponse(response.data);
      
      return {
        ...response,
        data: rank
      };
    }
    
    throw new Error('Ошибка при добавлении обязательной миссии к рангу');
  }

  // Удалить обязательную миссию из ранга
  async removeRequiredMissionFromRank(rankId: number, missionId: number): Promise<ApiResponse<Rank>> {
    const response = await httpClient.delete<RankResponse>(
      API_ENDPOINTS.RANKS.REMOVE_REQUIRED_MISSION(rankId, missionId)
    );
    
    if (response.data) {
      const rank = Rank.fromResponse(response.data);
      
      return {
        ...response,
        data: rank
      };
    }
    
    throw new Error('Ошибка при удалении обязательной миссии из ранга');
  }

  // Добавить обязательную компетенцию к рангу
  async addRequiredCompetencyToRank(
    rankId: number, 
    competencyId: number, 
    requirementData: AddRequiredCompetencyToRankRequest
  ): Promise<ApiResponse<Rank>> {
    const response = await httpClient.post<RankResponse>(
      API_ENDPOINTS.RANKS.ADD_REQUIRED_COMPETENCY(rankId, competencyId),
      requirementData
    );
    
    if (response.data) {
      const rank = Rank.fromResponse(response.data);
      
      return {
        ...response,
        data: rank
      };
    }
    
    throw new Error('Ошибка при добавлении обязательной компетенции к рангу');
  }

  // Удалить обязательную компетенцию из ранга
  async removeRequiredCompetencyFromRank(rankId: number, competencyId: number): Promise<ApiResponse<Rank>> {
    const response = await httpClient.delete<RankResponse>(
      API_ENDPOINTS.RANKS.REMOVE_REQUIRED_COMPETENCY(rankId, competencyId)
    );
    
    if (response.data) {
      const rank = Rank.fromResponse(response.data);
      
      return {
        ...response,
        data: rank
      };
    }
    
    throw new Error('Ошибка при удалении обязательной компетенции из ранга');
  }
}

// Экспортируем единственный экземпляр сервиса
export const rankService = new RankService();
export default rankService;
