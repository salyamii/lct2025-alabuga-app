import { httpClient } from '../httpClient';
import { API_ENDPOINTS } from '../config/apiConfig';
import { 
  TaskResponse,
  TasksResponse,
  TaskCreateRequest,
  TaskUpdateRequest,
  ApiResponse 
} from '../types/apiTypes';
import { Task } from '../../domain/task';

export class TaskService {
  // Получить список всех задач
  async getTasks(): Promise<ApiResponse<Task[]>> {
    const response = await httpClient.get<TasksResponse>(API_ENDPOINTS.TASKS.LIST);
    
    if (response.data) {
      const tasks = response.data.values.map(taskResponse => 
        Task.fromResponse(taskResponse)
      );
      
      return {
        ...response,
        data: tasks
      };
    }
    
    return {
      ...response,
      data: []
    };
  }

  // Получить задачу по ID
  async getTask(id: number): Promise<ApiResponse<Task>> {
    const response = await httpClient.get<TaskResponse>(API_ENDPOINTS.TASKS.GET(id));
    
    if (response.data) {
      const task = Task.fromResponse(response.data);
      
      return {
        ...response,
        data: task
      };
    }
    
    throw new Error('Задача не найдена');
  }

  // Создать новую задачу
  async createTask(taskData: TaskCreateRequest): Promise<ApiResponse<Task>> {
    const response = await httpClient.post<TaskResponse>(
      API_ENDPOINTS.TASKS.CREATE,
      taskData
    );
    
    if (response.data) {
      const task = Task.fromResponse(response.data);
      
      return {
        ...response,
        data: task
      };
    }
    
    throw new Error('Ошибка при создании задачи');
  }

  // Обновить задачу
  async updateTask(id: number, taskData: TaskUpdateRequest): Promise<ApiResponse<Task>> {
    const response = await httpClient.put<TaskResponse>(
      API_ENDPOINTS.TASKS.UPDATE(id),
      taskData
    );
    
    if (response.data) {
      const task = Task.fromResponse(response.data);
      
      return {
        ...response,
        data: task
      };
    }
    
    throw new Error('Ошибка при обновлении задачи');
  }

  // Удалить задачу
  async deleteTask(id: number): Promise<ApiResponse<void>> {
    return httpClient.delete<void>(API_ENDPOINTS.TASKS.DELETE(id));
  }
}

// Экспортируем единственный экземпляр сервиса
export const taskService = new TaskService();
export default taskService;
