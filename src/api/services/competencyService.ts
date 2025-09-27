import { httpClient } from '../httpClient';
import { API_ENDPOINTS } from '../config/apiConfig';
import { 
  CompetencyResponse,
  CompetenciesResponse,
  CompetencyCreateRequest,
  CompetencyUpdateRequest,
  ApiResponse 
} from '../types/apiTypes';
import { Competency } from '../../domain/competency';

export class CompetencyService {
  // Получить список всех компетенций
  async getCompetencies(): Promise<ApiResponse<Competency[]>> {
    const response = await httpClient.get<CompetenciesResponse>(API_ENDPOINTS.COMPETENCIES.LIST);
    
    if (response.data) {
      const competencies = response.data.values.map(competencyResponse => 
        Competency.fromResponse(competencyResponse)
      );
      
      return {
        ...response,
        data: competencies
      };
    }
    
    return {
      ...response,
      data: []
    };
  }

  // Получить компетенцию по ID
  async getCompetency(id: number): Promise<ApiResponse<Competency>> {
    const response = await httpClient.get<CompetencyResponse>(API_ENDPOINTS.COMPETENCIES.GET(id));
    
    if (response.data) {
      const competency = Competency.fromResponse(response.data);
      
      return {
        ...response,
        data: competency
      };
    }
    
    throw new Error('Компетенция не найдена');
  }

  // Создать новую компетенцию
  async createCompetency(competencyData: CompetencyCreateRequest): Promise<ApiResponse<Competency>> {
    const response = await httpClient.post<CompetencyResponse>(
      API_ENDPOINTS.COMPETENCIES.CREATE,
      competencyData
    );
    
    if (response.data) {
      const competency = Competency.fromResponse(response.data);
      
      return {
        ...response,
        data: competency
      };
    }
    
    throw new Error('Ошибка при создании компетенции');
  }

  // Обновить компетенцию
  async updateCompetency(id: number, competencyData: CompetencyUpdateRequest): Promise<ApiResponse<Competency>> {
    const response = await httpClient.put<CompetencyResponse>(
      API_ENDPOINTS.COMPETENCIES.UPDATE(id),
      competencyData
    );
    
    if (response.data) {
      const competency = Competency.fromResponse(response.data);
      
      return {
        ...response,
        data: competency
      };
    }
    
    throw new Error('Ошибка при обновлении компетенции');
  }

  // Удалить компетенцию
  async deleteCompetency(id: number): Promise<ApiResponse<void>> {
    return httpClient.delete<void>(API_ENDPOINTS.COMPETENCIES.DELETE(id));
  }

  // Добавить навык к компетенции
  async addSkillToCompetency(competencyId: number, skillId: number): Promise<ApiResponse<Competency>> {
    const response = await httpClient.post<CompetencyResponse>(
      API_ENDPOINTS.COMPETENCIES.ADD_SKILL(competencyId, skillId)
    );
    
    if (response.data) {
      const competency = Competency.fromResponse(response.data);
      
      return {
        ...response,
        data: competency
      };
    }
    
    throw new Error('Ошибка при добавлении навыка к компетенции');
  }

  // Удалить навык из компетенции
  async removeSkillFromCompetency(competencyId: number, skillId: number): Promise<ApiResponse<Competency>> {
    const response = await httpClient.delete<CompetencyResponse>(
      API_ENDPOINTS.COMPETENCIES.REMOVE_SKILL(competencyId, skillId)
    );
    
    if (response.data) {
      const competency = Competency.fromResponse(response.data);
      
      return {
        ...response,
        data: competency
      };
    }
    
    throw new Error('Ошибка при удалении навыка из компетенции');
  }
}

// Экспортируем единственный экземпляр сервиса
export const competencyService = new CompetencyService();
export default competencyService;
