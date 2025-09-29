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
    const baseURL = httpClient.getBaseURL();
    return `${baseURL}${API_ENDPOINTS.MEDIA.DOWNLOAD(key)}`;
  }

  // Получить превью URL для изображений (если поддерживается)
  getPreviewUrl(key: string): string {
    return this.getDownloadUrl(key);
  }

  // Загрузить изображение с авторизацией и вернуть Blob URL
  async loadImageWithAuth(imageUrl: string): Promise<string> {
    try {
      // Если это полный URL, загружаем через httpClient с авторизацией
      if (imageUrl.startsWith('http')) {
        const response = await httpClient.get(imageUrl, {
          responseType: 'blob'
        });
        
        const blob = new Blob([response.data], { type: 'image/*' });
        return URL.createObjectURL(blob);
      } else {
        // Если это ключ файла, используем downloadFile
        const blob = await this.downloadFile(imageUrl);
        return URL.createObjectURL(blob);
      }
    } catch (error) {
      console.error('Error loading image with auth:', error);
      throw error;
    }
  }
}

// Экспортируем единственный экземпляр сервиса
export const mediaService = new MediaService();
export default mediaService;
