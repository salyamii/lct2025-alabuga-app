import { httpClient } from '../httpClient';
import { API_ENDPOINTS } from '../config/apiConfig';
import { 
  MissionChainResponse,
  MissionChainsResponse,
  MissionChainCreateRequest,
  MissionChainUpdateRequest,
  MissionDependencyResponse,
  ApiResponse 
} from '../types/apiTypes';
import { MissionChain } from '../../domain/missionChain';

export class MissionChainService {
  // Получить список всех цепочек миссий
  async getMissionChains(): Promise<ApiResponse<MissionChain[]>> {
    const response = await httpClient.get<MissionChainsResponse>(API_ENDPOINTS.MISSION_CHAINS.LIST);
    
    if (response.data) {
      const missionChains = response.data.values.map(chainResponse => 
        MissionChain.fromResponse(chainResponse)
      );
      
      return {
        ...response,
        data: missionChains
      };
    }
    
    return {
      ...response,
      data: []
    };
  }

  // Получить цепочку миссий по ID
  async getMissionChain(id: number): Promise<ApiResponse<MissionChain>> {
    const response = await httpClient.get<MissionChainResponse>(API_ENDPOINTS.MISSION_CHAINS.GET(id));
    
    if (response.data) {
      const missionChain = MissionChain.fromResponse(response.data);
      
      return {
        ...response,
        data: missionChain
      };
    }
    
    throw new Error('Цепочка миссий не найдена');
  }

  // Создать новую цепочку миссий
  async createMissionChain(chainData: MissionChainCreateRequest): Promise<ApiResponse<MissionChain>> {
    const response = await httpClient.post<MissionChainResponse>(
      API_ENDPOINTS.MISSION_CHAINS.CREATE,
      chainData
    );
    
    if (response.data) {
      const missionChain = MissionChain.fromResponse(response.data);
      
      return {
        ...response,
        data: missionChain
      };
    }
    
    throw new Error('Ошибка при создании цепочки миссий');
  }

  // Обновить цепочку миссий
  async updateMissionChain(id: number, chainData: MissionChainUpdateRequest): Promise<ApiResponse<MissionChain>> {
    const response = await httpClient.put<MissionChainResponse>(
      API_ENDPOINTS.MISSION_CHAINS.UPDATE(id),
      chainData
    );
    
    if (response.data) {
      const missionChain = MissionChain.fromResponse(response.data);
      
      return {
        ...response,
        data: missionChain
      };
    }
    
    throw new Error('Ошибка при обновлении цепочки миссий');
  }

  // Удалить цепочку миссий
  async deleteMissionChain(id: number): Promise<ApiResponse<void>> {
    return httpClient.delete<void>(API_ENDPOINTS.MISSION_CHAINS.DELETE(id));
  }

  // Добавить миссию в цепочку
  async addMissionToChain(chainId: number, missionId: number): Promise<ApiResponse<MissionChain>> {
    const response = await httpClient.post<MissionChainResponse>(
      API_ENDPOINTS.MISSION_CHAINS.ADD_MISSION(chainId, missionId)
    );
    
    if (response.data) {
      const missionChain = MissionChain.fromResponse(response.data);
      
      return {
        ...response,
        data: missionChain
      };
    }
    
    throw new Error('Ошибка при добавлении миссии в цепочку');
  }

  // Удалить миссию из цепочки
  async removeMissionFromChain(chainId: number, missionId: number): Promise<ApiResponse<MissionChain>> {
    const response = await httpClient.delete<MissionChainResponse>(
      API_ENDPOINTS.MISSION_CHAINS.REMOVE_MISSION(chainId, missionId)
    );
    
    if (response.data) {
      const missionChain = MissionChain.fromResponse(response.data);
      
      return {
        ...response,
        data: missionChain
      };
    }
    
    throw new Error('Ошибка при удалении миссии из цепочки');
  }

  // Обновить порядок миссии в цепочке
  async updateMissionOrderInChain(
    chainId: number, 
    missionId: number, 
    newOrder: number
  ): Promise<ApiResponse<MissionChain>> {
    const response = await httpClient.put<MissionChainResponse>(
      `${API_ENDPOINTS.MISSION_CHAINS.UPDATE_MISSION_ORDER(chainId, missionId)}?new_order=${newOrder}`
    );
    
    if (response.data) {
      const missionChain = MissionChain.fromResponse(response.data);
      
      return {
        ...response,
        data: missionChain
      };
    }
    
    throw new Error('Ошибка при обновлении порядка миссии в цепочке');
  }

  // Добавить зависимость между миссиями в цепочке
  async addMissionDependency(
    chainId: number, 
    dependencyData: MissionDependencyResponse
  ): Promise<ApiResponse<MissionChain>> {
    const response = await httpClient.post<MissionChainResponse>(
      API_ENDPOINTS.MISSION_CHAINS.ADD_DEPENDENCY(chainId),
      dependencyData
    );
    
    if (response.data) {
      const missionChain = MissionChain.fromResponse(response.data);
      
      return {
        ...response,
        data: missionChain
      };
    }
    
    throw new Error('Ошибка при добавлении зависимости между миссиями');
  }

  // Удалить зависимость между миссиями в цепочке
  async removeMissionDependency(
    chainId: number, 
    dependencyData: MissionDependencyResponse
  ): Promise<ApiResponse<MissionChain>> {
    const response = await httpClient.delete<MissionChainResponse>(
      API_ENDPOINTS.MISSION_CHAINS.REMOVE_DEPENDENCY(chainId),
      { data: dependencyData }
    );
    
    if (response.data) {
      const missionChain = MissionChain.fromResponse(response.data);
      
      return {
        ...response,
        data: missionChain
      };
    }
    
    throw new Error('Ошибка при удалении зависимости между миссиями');
  }
}

// Экспортируем единственный экземпляр сервиса
export const missionChainService = new MissionChainService();
export default missionChainService;
