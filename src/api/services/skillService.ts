import { httpClient } from '../httpClient';
import { API_ENDPOINTS } from '../config/apiConfig';
import { 
  SkillResponse,
  SkillsResponse,
  SkillCreateRequest,
  SkillUpdateRequest,
  ApiResponse 
} from '../types/apiTypes';
import { Skill } from '../../domain/skill';

export class SkillService {
  // Получить список всех навыков
  async getSkills(): Promise<ApiResponse<Skill[]>> {
    const response = await httpClient.get<SkillsResponse>(API_ENDPOINTS.SKILLS.LIST);
    
    if (response.data) {
      const skills = response.data.values.map(skillResponse => 
        Skill.fromResponse(skillResponse)
      );
      
      return {
        ...response,
        data: skills
      };
    }
    
    return {
      ...response,
      data: []
    };
  }

  // Получить навык по ID
  async getSkill(id: number): Promise<ApiResponse<Skill>> {
    const response = await httpClient.get<SkillResponse>(API_ENDPOINTS.SKILLS.GET(id));
    
    if (response.data) {
      const skill = Skill.fromResponse(response.data);
      
      return {
        ...response,
        data: skill
      };
    }
    
    throw new Error('Навык не найден');
  }

  // Создать новый навык
  async createSkill(skillData: SkillCreateRequest): Promise<ApiResponse<Skill>> {
    const response = await httpClient.post<SkillResponse>(
      API_ENDPOINTS.SKILLS.CREATE,
      skillData
    );
    
    if (response.data) {
      const skill = Skill.fromResponse(response.data);
      
      return {
        ...response,
        data: skill
      };
    }
    
    throw new Error('Ошибка при создании навыка');
  }

  // Обновить навык
  async updateSkill(id: number, skillData: SkillUpdateRequest): Promise<ApiResponse<Skill>> {
    const response = await httpClient.put<SkillResponse>(
      API_ENDPOINTS.SKILLS.UPDATE(id),
      skillData
    );
    
    if (response.data) {
      const skill = Skill.fromResponse(response.data);
      
      return {
        ...response,
        data: skill
      };
    }
    
    throw new Error('Ошибка при обновлении навыка');
  }

  // Удалить навык
  async deleteSkill(id: number): Promise<ApiResponse<void>> {
    return httpClient.delete<void>(API_ENDPOINTS.SKILLS.DELETE(id));
  }
}

// Экспортируем единственный экземпляр сервиса
export const skillService = new SkillService();
export default skillService;
