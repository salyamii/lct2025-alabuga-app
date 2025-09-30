import { httpClient } from '../httpClient';
import { API_ENDPOINTS } from '../config/apiConfig';
import { 
  FileObjectResponse,
  Body_upload_file_media_post,
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
    // Валидация URL
    if (!imageUrl || imageUrl.trim() === '') {
      throw new Error('Image URL is empty');
    }

    // Проверка на невалидные URL (например, "broken link", "New Mission")
    if (!imageUrl.startsWith('http://') && 
        !imageUrl.startsWith('https://') && 
        !imageUrl.startsWith('/')) {
      throw new Error(`Invalid image URL: ${imageUrl}`);
    }

    try {
      let apiPath: string;
      
      // Если это полный URL, извлекаем путь для использования через API
      if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
        // Извлекаем путь из URL (например, /media/2025/09/29/image.png)
        const url = new URL(imageUrl);
        apiPath = url.pathname + url.search; // Добавляем query параметры если есть
      } else {
        // Если это уже путь, используем как есть
        apiPath = imageUrl;
      }
      
      // Загружаем через httpClient с авторизацией
      const response = await httpClient.get(apiPath, {
        responseType: 'blob'
      });
      
      // Создаем Blob URL для отображения
      const blob = new Blob([response.data], { type: 'image/*' });
      return URL.createObjectURL(blob);
    } catch (error: any) {
      throw error;
    }
  }
}

// Экспортируем единственный экземпляр сервиса
export const mediaService = new MediaService();
export default mediaService;
