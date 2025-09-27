import { httpClient } from '../httpClient';
import { API_ENDPOINTS } from '../config/apiConfig';
import { 
  FileObjectResponse,
  BodyUploadFileMediaPost,
  ApiResponse 
} from '../types/apiTypes';

export class MediaService {
  // Загрузить файл
  async uploadFile(file: File): Promise<ApiResponse<FileObjectResponse>> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await httpClient.post<FileObjectResponse>(
      API_ENDPOINTS.MEDIA.UPLOAD,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    if (response.data) {
      return {
        ...response,
        data: response.data
      };
    }
    
    throw new Error('Ошибка при загрузке файла');
  }

  // Скачать файл по ключу
  async downloadFile(key: string): Promise<Blob> {
    const response = await httpClient.get(
      API_ENDPOINTS.MEDIA.DOWNLOAD(key),
      {
        responseType: 'blob',
      }
    );
    
    return response.data;
  }

  // Получить URL для скачивания файла
  getDownloadUrl(key: string): string {
    const baseURL = httpClient.defaults.baseURL || '';
    return `${baseURL}${API_ENDPOINTS.MEDIA.DOWNLOAD(key)}`;
  }

  // Получить превью URL для изображений (если поддерживается)
  getPreviewUrl(key: string): string {
    return this.getDownloadUrl(key);
  }
}

// Экспортируем единственный экземпляр сервиса
export const mediaService = new MediaService();
export default mediaService;
