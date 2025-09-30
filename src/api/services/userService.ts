import { httpClient } from '../httpClient';
import { API_ENDPOINTS } from '../config/apiConfig';
import { 
  UserResponse,
  UserDetailedResponse,
  UserUpdateRequest,
  UsersListResponse,
  UserMissionResponse,
  UserMissionsListResponse,
  TaskCompleteRequest,
  ApiResponse 
} from '../types/apiTypes';

export class UserService {
  // Получение профиля текущего пользователя
  async getProfile(): Promise<ApiResponse<UserDetailedResponse>> {
    return httpClient.get<UserDetailedResponse>(API_ENDPOINTS.USERS.ME);
  }

  // Получение списка пользователей
  async getUsers(): Promise<ApiResponse<UsersListResponse>> {
    return httpClient.get<UsersListResponse>(API_ENDPOINTS.USERS.LIST);
  }

  // Получение информации о пользователе по логину
  async getUser(userLogin: string): Promise<ApiResponse<UserDetailedResponse>> {
    return httpClient.get<UserDetailedResponse>(API_ENDPOINTS.USERS.GET(userLogin));
  }

  // Обновление базовой информации пользователя
  async updateUser(userLogin: string, userData: UserUpdateRequest): Promise<ApiResponse<UserResponse>> {
    return httpClient.put<UserResponse>(API_ENDPOINTS.USERS.UPDATE(userLogin), userData);
  }

  // Получение списка миссий текущего пользователя
  async getUserMissions(): Promise<ApiResponse<UserMissionsListResponse>> {
    return httpClient.get<UserMissionsListResponse>(API_ENDPOINTS.USERS.MISSIONS_LIST);
  }

  // Получение списка миссий пользователя по логину
  async getUserMissionsByLogin(userLogin: string): Promise<ApiResponse<UserMissionsListResponse>> {
    return httpClient.get<UserMissionsListResponse>(API_ENDPOINTS.USERS.MISSIONS_LIST_BY_LOGIN(userLogin));
  }

  // Получение миссии пользователя с задачами и статусом выполнения
  async getUserMission(missionId: number): Promise<ApiResponse<UserMissionResponse>> {
    return httpClient.get<UserMissionResponse>(
      API_ENDPOINTS.USERS.MISSION(missionId)
    );
  }

  // Одобрение миссии пользователя (только для HR)
  async approveUserMission(missionId: number, userLogin: string): Promise<ApiResponse<void>> {
    return httpClient.post<void>(
      API_ENDPOINTS.USERS.APPROVE_MISSION(missionId),
      {},
      { params: { user_login: userLogin } }
    );
  }

  // Добавление артефакта пользователю
  async addArtifactToUser(userLogin: string, artifactId: number): Promise<ApiResponse<UserResponse>> {
    return httpClient.post<UserResponse>(API_ENDPOINTS.USERS.ADD_ARTIFACT(userLogin, artifactId));
  }

  // Удаление артефакта у пользователя
  async removeArtifactFromUser(userLogin: string, artifactId: number): Promise<ApiResponse<UserResponse>> {
    return httpClient.delete<UserResponse>(API_ENDPOINTS.USERS.REMOVE_ARTIFACT(userLogin, artifactId));
  }

  // Добавление компетенции пользователю
  async addCompetencyToUser(userLogin: string, competencyId: number, level: number = 0): Promise<ApiResponse<void>> {
    return httpClient.post<void>(
      API_ENDPOINTS.USERS.ADD_COMPETENCY(userLogin, competencyId),
      {},
      { params: { level } }
    );
  }

  // Обновление уровня компетенции пользователя
  async updateUserCompetencyLevel(userLogin: string, competencyId: number, level: number): Promise<ApiResponse<void>> {
    return httpClient.put<void>(
      API_ENDPOINTS.USERS.UPDATE_COMPETENCY(userLogin, competencyId),
      {},
      { params: { level } }
    );
  }

  // Удаление компетенции у пользователя
  async removeCompetencyFromUser(userLogin: string, competencyId: number): Promise<ApiResponse<void>> {
    return httpClient.delete<void>(API_ENDPOINTS.USERS.REMOVE_COMPETENCY(userLogin, competencyId));
  }

  // Добавление навыка пользователю в компетенции
  async addSkillToUser(userLogin: string, competencyId: number, skillId: number, level: number = 0): Promise<ApiResponse<void>> {
    return httpClient.post<void>(
      API_ENDPOINTS.USERS.ADD_SKILL(userLogin, competencyId, skillId),
      {},
      { params: { level } }
    );
  }

  // Обновление уровня навыка пользователя в компетенции
  async updateUserSkillLevel(userLogin: string, competencyId: number, skillId: number, level: number): Promise<ApiResponse<void>> {
    return httpClient.put<void>(
      API_ENDPOINTS.USERS.UPDATE_SKILL(userLogin, competencyId, skillId),
      {},
      { params: { level } }
    );
  }

  // Удаление навыка у пользователя в компетенции
  async removeSkillFromUser(userLogin: string, competencyId: number, skillId: number): Promise<ApiResponse<void>> {
    return httpClient.delete<void>(API_ENDPOINTS.USERS.REMOVE_SKILL(userLogin, competencyId, skillId));
  }

  // Завершение задачи пользователем
  async completeTask(taskId: number, userLogin: string): Promise<ApiResponse<void>> {
    return httpClient.post<void>(
      API_ENDPOINTS.USERS.COMPLETE_TASK(taskId),
      { userLogin }
    );
  }
}

// Экспортируем единственный экземпляр сервиса
export const userService = new UserService();
export default userService;
