import { httpClient } from '../httpClient';
import { API_ENDPOINTS } from '../config/apiConfig';
import { 
  StoreItemResponse,
  StoreItemCreateRequest,
  StoreItemUpdateRequest,
  StoreItemsResponse,
  StorePurchaseRequest,
  ApiResponse 
} from '../types/apiTypes';

export class StoreService {
  // Получить все товары в магазине
  async getStoreItems(): Promise<ApiResponse<StoreItemsResponse>> {
    const response = await httpClient.get<StoreItemsResponse>(API_ENDPOINTS.STORE.ITEMS);
    return response;
  }

  // Получить товар по ID
  async getStoreItem(itemId: number): Promise<ApiResponse<StoreItemResponse>> {
    const response = await httpClient.get<StoreItemResponse>(API_ENDPOINTS.STORE.ITEM(itemId));
    return response;
  }

  // Создать новый товар
  async createStoreItem(itemData: StoreItemCreateRequest): Promise<ApiResponse<StoreItemResponse>> {
    const response = await httpClient.post<StoreItemResponse>(
      API_ENDPOINTS.STORE.ITEMS,
      itemData
    );
    return response;
  }

  // Обновить товар
  async updateStoreItem(itemId: number, itemData: StoreItemUpdateRequest): Promise<ApiResponse<StoreItemResponse>> {
    const response = await httpClient.put<StoreItemResponse>(
      API_ENDPOINTS.STORE.ITEM(itemId),
      itemData
    );
    return response;
  }

  // Удалить товар
  async deleteStoreItem(itemId: number): Promise<ApiResponse<void>> {
    const response = await httpClient.delete<void>(API_ENDPOINTS.STORE.ITEM(itemId));
    return response;
  }

  // Купить товар
  async purchaseStoreItem(purchaseData: StorePurchaseRequest): Promise<ApiResponse<StoreItemResponse>> {
    const response = await httpClient.post<StoreItemResponse>(
      API_ENDPOINTS.STORE.PURCHASE,
      purchaseData
    );
    return response;
  }
}

// Экспортируем единственный экземпляр сервиса
export const storeService = new StoreService();
export default storeService;
