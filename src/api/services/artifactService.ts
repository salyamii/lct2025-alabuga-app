import { httpClient } from '../httpClient';
import { API_ENDPOINTS } from '../config/apiConfig';
import { 
  ArtifactResponse,
  ArtifactsResponse,
  ArtifactCreateRequest,
  ArtifactUpdateRequest,
  ApiResponse 
} from '../types/apiTypes';
import { Artifact } from '../../domain/artifact';

export class ArtifactService {
  // Получить список всех артефактов
  async getArtifacts(): Promise<ApiResponse<Artifact[]>> {
    const response = await httpClient.get<ArtifactsResponse>(API_ENDPOINTS.ARTIFACTS.LIST);
    
    if (response.data) {
      const artifacts = response.data.values.map(artifactResponse => 
        Artifact.fromResponse(artifactResponse)
      );
      
      return {
        ...response,
        data: artifacts
      };
    }
    
    return {
      ...response,
      data: []
    };
  }

  // Получить артефакт по ID
  async getArtifact(id: number): Promise<ApiResponse<Artifact>> {
    const response = await httpClient.get<ArtifactResponse>(API_ENDPOINTS.ARTIFACTS.GET(id));
    
    if (response.data) {
      const artifact = Artifact.fromResponse(response.data);
      
      return {
        ...response,
        data: artifact
      };
    }
    
    throw new Error('Артефакт не найден');
  }

  // Создать новый артефакт
  async createArtifact(artifactData: ArtifactCreateRequest): Promise<ApiResponse<Artifact>> {
    const response = await httpClient.post<ArtifactResponse>(
      API_ENDPOINTS.ARTIFACTS.CREATE,
      artifactData
    );
    
    if (response.data) {
      const artifact = Artifact.fromResponse(response.data);
      
      return {
        ...response,
        data: artifact
      };
    }
    
    throw new Error('Ошибка при создании артефакта');
  }

  // Обновить артефакт
  async updateArtifact(id: number, artifactData: ArtifactUpdateRequest): Promise<ApiResponse<Artifact>> {
    const response = await httpClient.put<ArtifactResponse>(
      API_ENDPOINTS.ARTIFACTS.UPDATE(id),
      artifactData
    );
    
    if (response.data) {
      const artifact = Artifact.fromResponse(response.data);
      
      return {
        ...response,
        data: artifact
      };
    }
    
    throw new Error('Ошибка при обновлении артефакта');
  }

  // Удалить артефакт
  async deleteArtifact(id: number): Promise<ApiResponse<void>> {
    return httpClient.delete<void>(API_ENDPOINTS.ARTIFACTS.DELETE(id));
  }
}

// Экспортируем единственный экземпляр сервиса
export const artifactService = new ArtifactService();
export default artifactService;
