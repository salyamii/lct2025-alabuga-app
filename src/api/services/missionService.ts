import { httpClient } from '../httpClient';
import { API_ENDPOINTS } from '../config/apiConfig';
import { 
  MissionResponse,
  MissionsResponse,
  MissionCreateRequest,
  MissionUpdateRequest,
  CompetencyRewardAddRequest,
  SkillRewardAddRequest,
  ApiResponse 
} from '../types/apiTypes';
import { Mission } from '../../domain/mission';

export class MissionService {
  // Получить список всех миссий
  async getMissions(): Promise<ApiResponse<Mission[]>> {
    const response = await httpClient.get<MissionsResponse>(API_ENDPOINTS.MISSIONS.LIST);
    
    if (response.data) {
      const missions = response.data.values.map(missionResponse => 
        Mission.fromResponse(missionResponse)
      );
      
      return {
        ...response,
        data: missions
      };
    }
    
    return {
      ...response,
      data: []
    };
  }

  // Получить миссию по ID
  async getMission(id: number): Promise<ApiResponse<Mission>> {
    const response = await httpClient.get<MissionResponse>(API_ENDPOINTS.MISSIONS.GET(id));
    
    if (response.data) {
      const mission = Mission.fromResponse(response.data);
      
      return {
        ...response,
        data: mission
      };
    }
    
    throw new Error('Миссия не найдена');
  }

  // Создать новую миссию
  async createMission(missionData: MissionCreateRequest): Promise<ApiResponse<Mission>> {
    const response = await httpClient.post<MissionResponse>(
      API_ENDPOINTS.MISSIONS.CREATE,
      missionData
    );
    
    if (response.data) {
      const mission = Mission.fromResponse(response.data);
      
      return {
        ...response,
        data: mission
      };
    }
    
    throw new Error('Ошибка при создании миссии');
  }

  // Обновить миссию
  async updateMission(id: number, missionData: MissionUpdateRequest): Promise<ApiResponse<Mission>> {
    const response = await httpClient.put<MissionResponse>(
      API_ENDPOINTS.MISSIONS.UPDATE(id),
      missionData
    );
    
    if (response.data) {
      const mission = Mission.fromResponse(response.data);
      
      return {
        ...response,
        data: mission
      };
    }
    
    throw new Error('Ошибка при обновлении миссии');
  }

  // Удалить миссию
  async deleteMission(id: number): Promise<ApiResponse<void>> {
    return httpClient.delete<void>(API_ENDPOINTS.MISSIONS.DELETE(id));
  }

  // Добавить задачу к миссии
  async addTaskToMission(missionId: number, taskId: number): Promise<ApiResponse<Mission>> {
    const response = await httpClient.post<MissionResponse>(
      API_ENDPOINTS.MISSIONS.ADD_TASK(missionId, taskId)
    );
    
    if (response.data) {
      const mission = Mission.fromResponse(response.data);
      
      return {
        ...response,
        data: mission
      };
    }
    
    throw new Error('Ошибка при добавлении задачи к миссии');
  }

  // Удалить задачу из миссии
  async removeTaskFromMission(missionId: number, taskId: number): Promise<ApiResponse<Mission>> {
    const response = await httpClient.delete<MissionResponse>(
      API_ENDPOINTS.MISSIONS.REMOVE_TASK(missionId, taskId)
    );
    
    if (response.data) {
      const mission = Mission.fromResponse(response.data);
      
      return {
        ...response,
        data: mission
      };
    }
    
    throw new Error('Ошибка при удалении задачи из миссии');
  }

  // Добавить награду компетенции к миссии
  async addCompetencyRewardToMission(
    missionId: number, 
    competencyId: number, 
    rewardData: CompetencyRewardAddRequest
  ): Promise<ApiResponse<Mission>> {
    const response = await httpClient.post<MissionResponse>(
      API_ENDPOINTS.MISSIONS.ADD_COMPETENCY_REWARD(missionId, competencyId),
      rewardData
    );
    
    if (response.data) {
      const mission = Mission.fromResponse(response.data);
      
      return {
        ...response,
        data: mission
      };
    }
    
    throw new Error('Ошибка при добавлении награды компетенции к миссии');
  }

  // Удалить награду компетенции из миссии
  async removeCompetencyRewardFromMission(missionId: number, competencyId: number): Promise<ApiResponse<Mission>> {
    const response = await httpClient.delete<MissionResponse>(
      API_ENDPOINTS.MISSIONS.REMOVE_COMPETENCY_REWARD(missionId, competencyId)
    );
    
    if (response.data) {
      const mission = Mission.fromResponse(response.data);
      
      return {
        ...response,
        data: mission
      };
    }
    
    throw new Error('Ошибка при удалении награды компетенции из миссии');
  }

  // Добавить награду навыка к миссии
  async addSkillRewardToMission(
    missionId: number, 
    skillId: number, 
    rewardData: SkillRewardAddRequest
  ): Promise<ApiResponse<Mission>> {
    const response = await httpClient.post<MissionResponse>(
      API_ENDPOINTS.MISSIONS.ADD_SKILL_REWARD(missionId, skillId),
      rewardData
    );
    
    if (response.data) {
      const mission = Mission.fromResponse(response.data);
      
      return {
        ...response,
        data: mission
      };
    }
    
    throw new Error('Ошибка при добавлении награды навыка к миссии');
  }

  // Удалить награду навыка из миссии
  async removeSkillRewardFromMission(missionId: number, skillId: number): Promise<ApiResponse<Mission>> {
    const response = await httpClient.delete<MissionResponse>(
      API_ENDPOINTS.MISSIONS.REMOVE_SKILL_REWARD(missionId, skillId)
    );
    
    if (response.data) {
      const mission = Mission.fromResponse(response.data);
      
      return {
        ...response,
        data: mission
      };
    }
    
    throw new Error('Ошибка при удалении награды навыка из миссии');
  }

  // Добавить артефакт к миссии
  async addArtifactToMission(missionId: number, artifactId: number): Promise<ApiResponse<Mission>> {
    const response = await httpClient.post<MissionResponse>(
      API_ENDPOINTS.MISSIONS.ADD_ARTIFACT(missionId, artifactId)
    );
    
    if (response.data) {
      const mission = Mission.fromResponse(response.data);
      
      return {
        ...response,
        data: mission
      };
    }
    
    throw new Error('Ошибка при добавлении артефакта к миссии');
  }

  // Удалить артефакт из миссии
  async removeArtifactFromMission(missionId: number, artifactId: number): Promise<ApiResponse<Mission>> {
    const response = await httpClient.delete<MissionResponse>(
      API_ENDPOINTS.MISSIONS.REMOVE_ARTIFACT(missionId, artifactId)
    );
    
    if (response.data) {
      const mission = Mission.fromResponse(response.data);
      
      return {
        ...response,
        data: mission
      };
    }
    
    throw new Error('Ошибка при удалении артефакта из миссии');
  }
}

// Экспортируем единственный экземпляр сервиса
export const missionService = new MissionService();
export default missionService;
