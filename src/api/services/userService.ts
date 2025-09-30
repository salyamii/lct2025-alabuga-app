import { httpClient } from '../httpClient';
import { API_ENDPOINTS } from '../config/apiConfig';
import { 
  UserResponse,
  UserMissionResponse,
  ApiResponse 
} from '../types/apiTypes';

export class UserService {
  // Получение профиля текущего пользователя
  async getProfile(): Promise<ApiResponse<UserResponse>> {
    return httpClient.get<UserResponse>(API_ENDPOINTS.USERS.ME);
  }

  // Получение миссии пользователя с задачами и статусом выполнения
  async getUserMission(missionId: number): Promise<ApiResponse<UserMissionResponse>> {
    return httpClient.get<UserMissionResponse>(
      API_ENDPOINTS.USERS.MISSION(missionId)
    );
  }
}

// Экспортируем единственный экземпляр сервиса
export const userService = new UserService();
export default userService;
